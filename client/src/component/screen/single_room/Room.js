import {
	Button,
	Container,
	Grid,
	IconButton,
	makeStyles,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import { closeModal, openModal, showFlash } from "../../../actions";
import { LOGIN_MODAL } from "../../modal/modalTypes";
import ChatLog from "./ChatLog";
import GameArea from "./GameArea";
import UserList from "./UserList";

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
	},
	[theme.breakpoints.down("xs")]: {
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

	// useEffect(() => {
	// 	socket = io(ENDPOINT);
	// 	if (auth.isLoggedIn) {
	// 		dispatch(closeModal());
	// 		socket.emit(
	// 			"joinRoom",
	// 			{
	// 				username: auth.userInfo.username,
	// 				userId: auth.userInfo?._id,
	// 				roomId: match.params.roomId,
	// 			},
	// 			(response) => {
	// 				if (!response.success) {
	// 					dispatch(
	// 						showFlash({
	// 							message: response.message,
	// 							duration: 1500,
	// 							severity: "error",
	// 						})
	// 					);
	// 					history.push("/");
	// 				}
	// 			}
	// 		);
	// 	} else {
	// 		dispatch(openModal({ modalName: LOGIN_MODAL }));
	// 	}

	// 	return () => {
	// 		socket.off();
	// 		socket.close();
	// 	};
	// }, [auth]);

	// useEffect(() => {
	// 	socket.on("message", (message) => {
	// 		console.log(message);
	// 	});

	// 	return () => {
	// 		socket.off();
	// 		socket.close();
	// 	};
	// }, []);

	return (
		<Container className={classes.root}>
			<Grid container spacing={2} alignItems="stretch">
				<Grid item xs={12} sm="auto" className={classes.sidebarGrid}>
					<UserList />
					<Button variant="contained" className={classes.leaveBtn}>
						Leave Room
					</Button>
					<ChatLog />
				</Grid>
				<Grid item xs={12} sm className={classes.gameAreaGrid}>
					<GameArea />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Room;
