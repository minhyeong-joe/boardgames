import { Button, Container, Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import { useImmer } from "use-immer";

import { closeModal, openModal, showFlash } from "../../../actions";
import { LOGIN_MODAL } from "../../modal/modalTypes";
import ChatLog from "./ChatLog";
import UserList from "./UserList";
import boardGames from "../../../games/games";
import ForSale from "../../../games/ForSale/ForSale";

let socket;

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		marginTop: theme.spacing(2),
	},
	leaveBtn: {
		width: "240px",
		display: "block",
		backgroundColor: theme.palette.error.main,
		color: theme.palette.error.contrastText,
		"&:hover": {
			backgroundColor: theme.palette.error.dark,
		},
		marginTop: "15px",
		marginBottom: "15px",
	},
	sidebarGrid: {
		order: 1,
	},
	gameAreaGrid: {
		order: 2,
		display: "flex",
		flexWrap: "wrap",
	},
	[theme.breakpoints.down("sm")]: {
		sidebarGrid: {
			order: 2,
		},
		gameAreaGrid: {
			order: 1,
		},
		leaveBtn: {
			width: "100%",
			order: 4,
		},
	},
}));

const Room = ({ match }) => {
	const classes = useStyles();
	const history = useHistory();
	const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
	const auth = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const [room, setRoom] = useState(null);
	const [messages, setMessages] = useImmer([]);
	const [logs, setLogs] = useImmer([]);

	useEffect(() => {
		if (auth.isLoggedIn) {
			dispatch(closeModal());
			socket = io(ENDPOINT);
			socket.emit(
				"joinRoom",
				{
					username: auth.userInfo.username,
					userId: auth.userInfo?._id,
					roomId: match.params.roomId,
				},
				(response) => {
					if (!response.success) {
						dispatch(
							showFlash({
								message: response.message,
								duration: 1500,
								severity: "error",
							})
						);
						history.push("/");
					} else {
						setRoom(response.room);
					}
				}
			);

			socket.on("updateRoom", ({ room: newRoom }) => {
				setRoom(newRoom);
			});
		} else {
			setRoom(null);
			dispatch(openModal({ modalName: LOGIN_MODAL }));
		}

		return () => {
			socket?.off();
			socket?.close();
		};
	}, [auth]);

	useEffect(() => {
		socket?.on("message", (message) => {
			setMessages((msgs) => {
				return [...msgs, message];
			});
		});

		socket?.on("log", (log) => {
			setLogs((logs) => {
				return [...logs, log];
			});
		});

		return () => {
			socket?.off("message");
			socket?.off("log");
		};
	}, [socket, setMessages, setLogs]);

	const onLeaveClick = () => {
		if (!auth.isLoggedIn) {
			history.push("/");
		} else {
			history.push(`/game/${room.gameId}`);
		}
	};

	const renderGame = () => {
		const gameName = boardGames.find(
			(boardGame) => boardGame.id === room.gameId
		).name;
		switch (gameName) {
			case "For Sale":
				return <ForSale socket={socket} room={room} />;
			default:
				return null;
		}
	};

	return (
		<Container className={classes.root}>
			<Grid container spacing={2} alignItems="stretch">
				<Grid item xs={12} md="auto" className={classes.sidebarGrid}>
					<UserList members={room?.members} />
					<ChatLog messages={messages} logs={logs} socket={socket} />
					<Button
						variant="contained"
						className={classes.leaveBtn}
						onClick={onLeaveClick}
					>
						Leave Room
					</Button>
				</Grid>
				<Grid item xs={12} md className={classes.gameAreaGrid}>
					{room && renderGame()}
				</Grid>
			</Grid>
		</Container>
	);
};

export default Room;
