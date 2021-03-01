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
import React, { Fragment, useEffect } from "react";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
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

	useEffect(() => {
		console.log(gameState);
	}, [gameState]);

	return (
		<div className={classes.root}>
			<Button variant="contained" color="primary">
				Start Game
			</Button>
			<Typography variant="h5">Waiting for owner to start game</Typography>
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
									<Typography variant="overline">SCORE</Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell component="th" scope="row">
									<Typography variant="subtitle1">1.</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="body1">username123</Typography>
								</TableCell>
								<TableCell align="center">
									<Typography variant="body1">85</Typography>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell component="th" scope="row">
									<Typography variant="subtitle1">2.</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="body1">user895412</Typography>
								</TableCell>
								<TableCell align="center">
									<Typography variant="body1">81</Typography>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell component="th" scope="row">
									<Typography variant="subtitle1">3.</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="body1">user899063</Typography>
								</TableCell>
								<TableCell align="center">
									<Typography variant="body1">78</Typography>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</Paper>
		</div>
	);
};

export default PhaseThree;
