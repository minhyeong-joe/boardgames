import { Button, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import boardGames from "../../games/games";

const GameStart = ({ socket, room }) => {
	const [isOwner, setIsOwner] = useState(false);
	const [isEnough, setIsEnough] = useState(false);
	const auth = useSelector((state) => state.auth);

	useEffect(() => {
		const ownerId = room.members[0].userId;
		setIsEnough(
			room.members.length >= boardGames.find((bg) => bg.id === room.gameId).min
		);
		setIsOwner(ownerId === auth.userInfo?._id);
	}, [auth, room]);

	const onGameStart = () => {
		socket.emit("initForSale", { room });
		socket.emit("startGame", { roomId: room.id });
	};

	return (
		<>
			{isOwner ? (
				<Button
					variant="contained"
					color="primary"
					onClick={onGameStart}
					// uncomment below to disable game start when there's not enough players
					disabled={!isEnough}
				>
					Start Game
				</Button>
			) : (
				<Typography variant="h5">
					Wait for room owner to begin the game
				</Typography>
			)}
		</>
	);
};

export default GameStart;
