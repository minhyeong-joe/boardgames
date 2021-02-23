import React from "react";
import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaBrain } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";

const useStyles = makeStyles((theme) => ({
	gameInfoRow: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "516px",
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		maxWidth: "90vw",
	},
	gameImageContainer: {
		width: "250px",
		height: "250px",
		marginRight: theme.spacing(2),
	},
	gameImage: {
		width: "100%",
		height: "100%",
		objectFit: "cover",
	},
	gameInfo: {
		textAlign: "left",
		width: "250px",
	},
	infoText: {
		fontSize: theme.typography.body1.fontSize,
		textTransform: "capitalize",
	},
	[theme.breakpoints.down("xs")]: {
		gameInfoRow: {
			flexDirection: "column",
		},
		gameImageContainer: {
			marginRight: 0,
		},
	},
}));

const GameDetail = ({ game }) => {
	const classes = useStyles();

	return (
		<div className={classes.gameInfoRow}>
			<div className={classes.gameImageContainer}>
				<img
					src={game.image_url}
					alt={game.name}
					className={classes.gameImage}
				/>
			</div>
			<div className={classes.gameInfo}>
				<Typography variant="h5">{game.name}</Typography>
				<Grid container alignItems="center" spacing={1}>
					<Grid item>
						<HiOutlineUserGroup size="30px" />
					</Grid>
					<Grid item xs>
						<Typography variant="subtitle1" className={classes.infoText}>
							{game.min}-{game.max}
						</Typography>
					</Grid>
				</Grid>
				<Grid container alignItems="center" spacing={1}>
					<Grid item>
						<FaBrain size="30px" />
					</Grid>
					<Grid item xs>
						<Typography variant="subtitle1" className={classes.infoText}>
							{game.complexity}
						</Typography>
					</Grid>
				</Grid>
				<Grid container alignItems="center" spacing={1}>
					<Grid item>
						<GiSandsOfTime size="30px" />
					</Grid>
					<Grid item xs>
						<Typography variant="subtitle1" className={classes.infoText}>
							{game.duration}
						</Typography>
					</Grid>
				</Grid>
				<Button variant="outlined">Game Rule</Button>
			</div>
		</div>
	);
};

export default GameDetail;
