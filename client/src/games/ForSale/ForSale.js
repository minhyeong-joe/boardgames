import { Button, Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GameStart from "./GameStart";
import PhaseOne from "./PhaseOne";
import PhaseTwo from "./PhaseTwo";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		minHeight: "50vh",
		border: `1px solid ${theme.palette.grey[500]}`,
	},
}));

const ForSale = ({ socket, room }) => {
	const classes = useStyles();
	const auth = useSelector((state) => state.auth);
	const [gameState, setGameState] = useState(null);

	useEffect(() => {
		socket.on("updateGameState", (gameState) => {
			setGameState(gameState);
		});
	}, [socket, setGameState]);

	useEffect(() => {
		console.log(gameState);
	}, [gameState]);

	return (
		<Grid
			container
			justify="center"
			alignItems={gameState ? "flex-start" : "center"}
			className={classes.root}
		>
			{!gameState && <GameStart socket={socket} room={room} />}
			{gameState && gameState.phase === 1 && (
				<PhaseOne socket={socket} gameState={gameState} room={room} />
			)}
			{gameState && gameState.phase === 2 && (
				<PhaseTwo socket={socket} gameState={gameState} room={room} />
			)}
		</Grid>
	);
};

export default ForSale;
