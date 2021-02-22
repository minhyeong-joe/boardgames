import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, FormSpy } from "react-final-form";
import { Button, Container, Grid, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CachedIcon from "@material-ui/icons/Cached";
import io from "socket.io-client";

import GameDetail from "./GameDetail";
import RoomTable from "./RoomTable";
import Input from "../../form/Input";
import CheckBox from "../../form/CheckBox";
import { openModal } from "../../../actions";
import { CREATE_ROOM_MODAL, LOGIN_MODAL } from "../../modal/modalTypes";
import { ROOM_API } from "../../../axios";

let socket;

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	createRoomBtn: {
		backgroundColor: theme.palette.success.main,
		marginBottom: theme.spacing(2),
		"&:hover": {
			backgroundColor: theme.palette.success.dark,
		},
	},
	[theme.breakpoints.down("sm")]: {
		btnGroup: {
			justifyContent: "center",
			marginTop: theme.spacing(1),
		},
	},
}));

const SingleGame = ({ match }) => {
	const classes = useStyles();
	const auth = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const { gameId } = match.params;
	const [rooms, setRooms] = useState([]);
	const [filteredRooms, setFilteredRooms] = useState([]);
	const SOCKET_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
	const [search, setSearch] = useState("");
	const [showPrivate, setShowPrivate] = useState(true);
	const [showFull, setShowFull] = useState(true);

	// useEffect(() => {
	// 	(async () => {
	// 		const { data } = await ROOM_API.get(gameId);
	// 		if (data.success) {
	// 			setRooms(data.rooms);
	// 		}
	// 	})();
	// }, [gameId]);

	useEffect(() => {
		socket = io(SOCKET_ENDPOINT);
		socket.emit("joinLobby", { gameId: gameId }, (rooms) => setRooms(rooms));

		return () => {
			socket.off();
			socket.close();
		};
	}, []);

	useEffect(() => {
		socket.on("loadRooms", ({ rooms }) => {
			setRooms(rooms);
		});

		return () => {
			socket.off();
			socket.close();
		};
	}, []);

	useEffect(() => {
		console.log("filter rooms");
		setFilteredRooms(
			rooms.filter(
				(room) =>
					(!search || room.name.toLowerCase().includes(search.toLowerCase())) &&
					(showPrivate || !room.isPrivate) &&
					(showFull || room.maxOccupancy >= room.members.length)
			)
		);
	}, [search, showPrivate, showFull, rooms]);

	const onCreateRoomClick = () => {
		if (auth.isLoggedIn) {
			// show create new room modal
			dispatch(
				openModal({
					modalName: CREATE_ROOM_MODAL,
					data: { gameId, socket },
				})
			);
		} else {
			dispatch(openModal({ modalName: LOGIN_MODAL }));
		}
	};

	// const onSubmit = (values) => {
	// 	console.log(values);
	// 	socket.emit("joinLobby", { gameId: gameId }, (rooms) =>
	// 		setRooms(
	// 			rooms.filter(
	// 				(room) =>
	// 					(!values.search ||
	// 						room.name.toLowerCase().includes(values.search.toLowerCase())) &&
	// 					(values.showPrivate || !room.isPrivate) &&
	// 					(values.showFull || room.maxOccupancy >= room.members.length)
	// 			)
	// 		)
	// 	);
	// };

	return (
		<Container className={classes.root}>
			<GameDetail gameId={match.params.gameId} />
			<Form
				onSubmit={() => {}}
				initialValues={{ search: "", showPrivate: true, showFull: true }}
			>
				{({ handleSubmit }) => (
					<>
						<form onSubmit={handleSubmit} id="filter-form">
							<Grid
								container
								justify="center"
								alignItems="center"
								spacing={1}
								className={classes.formRow}
							>
								<Grid item xs={10} sm={10} md="auto">
									<Field
										name="search"
										placeholder="Search"
										component={Input}
										label="Room Name"
									/>
								</Grid>
								<Grid item xs={10} sm={5} md="auto">
									<Field name="showPrivate" type="checkbox">
										{({ input, meta }) => (
											<CheckBox {...input} label="Show Private Room" />
										)}
									</Field>
								</Grid>
								<Grid item xs={10} sm={5} md="auto">
									<Field name="showFull" type="checkbox">
										{({ input, meta }) => (
											<CheckBox {...input} label="Show Full Room" />
										)}
									</Field>
								</Grid>
							</Grid>
							<Grid
								container
								justify="flex-end"
								spacing={2}
								className={classes.btnGroup}
							>
								{/* <Grid item>
									<Button
										variant="contained"
										color="primary"
										startIcon={<CachedIcon />}
										type="submit"
									>
										Refresh
									</Button>
								</Grid> */}
								<Grid item>
									<Button
										variant="contained"
										color="primary"
										startIcon={<AddIcon />}
										className={classes.createRoomBtn}
										onClick={onCreateRoomClick}
									>
										Create a Room
									</Button>
								</Grid>
							</Grid>
						</form>
						<FormSpy
							onChange={({ values }) => {
								setSearch(values.search);
								setShowPrivate(values.showPrivate);
								setShowFull(values.showFull);
								// socket?.emit("joinLobby", { gameId: gameId }, (rooms) =>
								// 	setRooms(
								// 		rooms.filter(
								// 			(room) =>
								// 				(!values.search ||
								// 					room.name
								// 						.toLowerCase()
								// 						.includes(values.search.toLowerCase())) &&
								// 				(values.showPrivate || !room.isPrivate) &&
								// 				(values.showFull ||
								// 					room.maxOccupancy >= room.members.length)
								// 		)
								// 	)
								// );
							}}
						/>
					</>
				)}
			</Form>

			<RoomTable rooms={filteredRooms} socket={socket} />
		</Container>
	);
};

export default SingleGame;
