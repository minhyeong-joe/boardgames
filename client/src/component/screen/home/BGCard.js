import React from "react";
import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	CardMedia,
	Grid,
	makeStyles,
	Typography,
} from "@material-ui/core";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaBrain } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";

const useStyles = makeStyles((theme) => ({
	card: {
		borderRadius: theme.spacing(1),
	},
	cardBody: {
		padding: theme.spacing(2),
	},
	image: {
		paddingTop: "100%",
		borderTopLeftRadius: theme.spacing(1),
		borderTopRightRadius: theme.spacing(1),
	},
	link: {
		textDecoration: "none",
		color: "inherit",
	},
	gameTitle: {
		fontSize: theme.typography.h5.fontSize,
	},
	infoText: {
		fontSize: theme.typography.body1.fontSize,
		textTransform: "capitalize",
	},
}));

const BGCard = ({ boardgame }) => {
	const classes = useStyles();

	return (
		<Card raised className={classes.card}>
			<Link to={`/game/${boardgame.id}`}>
				<CardMedia
					image={boardgame.image_url}
					title={boardgame.name}
					className={classes.image}
				/>
			</Link>
			<CardContent className={classes.cardBody}>
				<Link to={`/game/${boardgame.id}`} className={classes.link}>
					<Typography variant="body1" className={classes.gameTitle}>
						{boardgame.name}
					</Typography>
				</Link>
				<Grid container alignItems="center" spacing={1}>
					<Grid item>
						<HiOutlineUserGroup size="30px" />
					</Grid>
					<Grid item xs>
						<Typography variant="subtitle1" className={classes.infoText}>
							{boardgame.min}-{boardgame.max}
						</Typography>
					</Grid>
				</Grid>
				<Grid container alignItems="center" spacing={1}>
					<Grid item>
						<FaBrain size="30px" />
					</Grid>
					<Grid item xs>
						<Typography variant="subtitle1" className={classes.infoText}>
							{boardgame.complexity}
						</Typography>
					</Grid>
				</Grid>
				<Grid container alignItems="center" spacing={1}>
					<Grid item>
						<GiSandsOfTime size="30px" />
					</Grid>
					<Grid item xs>
						<Typography variant="subtitle1" className={classes.infoText}>
							{boardgame.duration}
						</Typography>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default BGCard;
