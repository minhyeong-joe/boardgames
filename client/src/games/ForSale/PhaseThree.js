import {
	Button,
	Divider,
	Grid,
	makeStyles,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GameStart from "./GameStart";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
	},
	scoreBoard: {
		maxWidth: "600px",
		width: "90%",
		margin: theme.spacing(3),
		padding: theme.spacing(2),
	},
	tableContainer: {
		overflow: "auto",
		margin: theme.spacing(1),
	},
}));

const PhaseThree = ({ socket, gameState, room }) => {
	const classes = useStyles();
	const [showStart, setShowStart] = useState(false);
	const [ranking, setRanking] = useState([]);
	const auth = useSelector((state) => state.auth);

	useEffect(() => {
		setTimeout(() => {
			setShowStart(true);
		}, 5000);
	}, []);

	useEffect(() => {
		const ownerId = room.members.find((member) => member.isOwner).userId;
		if (ownerId === auth.userInfo?._id) {
			socket.emit("moveTurn", { roomId: room.id });
		}
	}, [auth]);

	useEffect(() => {
		const playerRanking = [];
		gameState?.players.forEach((player) => {
			playerRanking.push({
				username: player.username,
				coinScore: player.coinScore,
				totalScore: player.coinScore + player.currencyScore,
			});
		});
		playerRanking.sort((a, b) => {
			if (a.totalScore > b.totalScore) return -1;
			else if (a.totalScore < b.totalScore) return 1;
			else {
				if (a.coinScore > b.coinScore) return -1;
				else return 1;
			}
		});
		setRanking(playerRanking);
	}, [gameState]);

	return (
		<div className={classes.root}>
			{showStart && (
				<GameStart socket={socket} gameState={gameState} room={room} />
			)}
			<Paper className={classes.scoreBoard}>
				<Typography variant="h4" align="center">
					Score Board
				</Typography>
				<Divider />
				<div className={classes.tableContainer}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell size="small" align="center" padding="checkbox">
									#
								</TableCell>
								<TableCell size="small">
									<Typography variant="overline">USERNAME</Typography>
								</TableCell>
								<TableCell size="small" align="center">
									<Typography variant="overline">SCORE (Coins)</Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{ranking.map((player, index) => (
								<TableRow
									selected={player.username === auth.userInfo?.username}
									key={index}
								>
									<TableCell component="th" scope="row">
										<Typography variant="subtitle1">{index + 1}.</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="body1">{player.username}</Typography>
									</TableCell>
									<TableCell align="center">
										<Typography variant="body1">{`${player.totalScore} (${player.coinScore})`}</Typography>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Paper>
		</div>
	);
};

export default PhaseThree;
