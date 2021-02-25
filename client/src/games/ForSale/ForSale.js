import { Button, Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import boardGames from "../../games/games";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		minHeight: "50vh",
		border: `1px solid ${theme.palette.grey[500]}`,
	},
	disabled: {
		pointerEvents: "none",
	},
}));

const gameName = "For Sale";

const ForSale = ({ socket, room }) => {
	const classes = useStyles();
	const auth = useSelector((state) => state.auth);
	const [gameState, setGameState] = useState(null);
	const [myTurn, setMyTurn] = useState(false);

	useEffect(() => {
		socket.on("updateGameState", (gameState) => {
			setGameState(gameState);
		});
	}, [socket, setGameState]);

	useEffect(() => {
		console.log(gameState);
		const isMyTurn =
			gameState?.players.find((player) => player.isTurn).userId ===
			auth.userInfo._id;
		setMyTurn(isMyTurn);
	}, [gameState]);

	const renderStartGameBtn = () => {
		const ownerId = room.members[0].userId;
		const isPlayersEnough =
			room.members.length >= boardGames.find((bg) => bg.id === room.gameId).min;

		const onGameStart = () => {
			socket.emit("startGame", { gameName, room });
		};
		if (ownerId === auth.userInfo._id) {
			return (
				<Button
					variant="contained"
					color="primary"
					onClick={onGameStart}
					// uncomment below to disable game start when there's not enough players
					// disabled={!isPlayersEnough}
				>
					Start Game
				</Button>
			);
		}
	};

	const renderPhaseOne = () => {
		const onPassTurn = () => {
			if (myTurn) {
				const currentPlayerIndex = gameState.players.findIndex(
					(player) => player.userId === auth.userInfo._id
				);
				const nextPlayerIndex =
					currentPlayerIndex + 1 >= gameState.players.length
						? 0
						: currentPlayerIndex + 1;
				const players = gameState.players.map((player, index) => {
					if (index === nextPlayerIndex) {
						return {
							...player,
							isTurn: true,
						};
					}
					return {
						...player,
						isTurn: false,
					};
				});
				const newGameState = {
					...gameState,
					players,
				};
				socket.emit("updateGameState", {
					gameName,
					room,
					newGameState,
					userId: auth.userInfo._id,
				});
			}
		};

		const onEndGame = () => {
			if (myTurn) {
				socket.emit("endGame", { gameName, room }, () => {
					socket.emit("moveTurn", { roomId: room.id });
				});
			}
		};

		return (
			<div className={myTurn ? "" : classes.disabled}>
				<Button onClick={onPassTurn}>Pass Turn</Button>
				<Button onClick={onEndGame}>End Game</Button>
			</div>
		);
	};

	return (
		<Grid
			container
			justify="center"
			alignItems="center"
			className={classes.root}
		>
			{!gameState && renderStartGameBtn()}
			{gameState && gameState.phase === 1 && renderPhaseOne()}
		</Grid>
	);
};

export default ForSale;