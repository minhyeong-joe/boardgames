import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form } from "react-final-form";
import axios from "axios";
import { Button, Container, Grid, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CachedIcon from "@material-ui/icons/Cached";

import GameDetail from "./GameDetail";
import RoomTable from "./RoomTable";
import Input from "../../form/Input";
import CheckBox from "../../form/CheckBox";
import { openModal } from "../../../actions";
import { LOGIN_MODAL } from "../../modal/modalTypes";

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

	useEffect(() => {
		console.log(window.location);
		(async () => {
			const { data } = await axios.get(
				`${window.location.protocol}//${window.location.hostname}/api/rooms/${gameId}`
			);
			console.log(data);
			if (data.success) {
				setRooms(data.rooms);
			}
		})();
	}, [gameId]);

	const onSubmit = async (values) => {
		if (values.search === undefined) {
			values.search = "";
		}
		const { data } = await axios.get(
			`${window.location.protocol}//${window.location.hostname}/api/rooms/${gameId}`
		);
		if (data.success) {
			setRooms(
				data.rooms.filter(
					(room) =>
						room.name.toLowerCase().includes(values.search.toLowerCase()) &&
						(values.showPrivate || !room.isPrivate) &&
						(values.showFull || room.maxOccupancy > room.numMembers)
				)
			);
		}
	};

	const onCreateRoomClick = () => {
		if (auth.isLoggedIn) {
			// show create new room modal
		} else {
			dispatch(openModal(LOGIN_MODAL));
		}
	};

	return (
		<Container className={classes.root}>
			<GameDetail gameId={match.params.gameId} />
			<Form
				onSubmit={onSubmit}
				initialValues={{ search: "", showPrivate: true, showFull: true }}
			>
				{({ handleSubmit }) => (
					<form onSubmit={handleSubmit}>
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
							<Grid item>
								<Button
									variant="contained"
									color="primary"
									startIcon={<CachedIcon />}
									type="submit"
								>
									Refresh
								</Button>
							</Grid>
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
				)}
			</Form>

			<RoomTable rooms={rooms} />
		</Container>
	);
};

export default SingleGame;
