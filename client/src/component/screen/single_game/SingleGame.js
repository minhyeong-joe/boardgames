import React from "react";
import {
	Button,
	Container,
	Grid,
	makeStyles,
	Typography,
} from "@material-ui/core";
import { useDispatch } from "react-redux";

import { openModal } from "../../../actions";
import { LOGIN_MODAL } from "../../modal/modalTypes";
import images from "../../../assets/image";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaBrain } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
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
	"@media screen and (max-width: 500px)": {
		gameInfoRow: {
			flexDirection: "column",
		},
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
}));

const SingleGame = ({ match }) => {
	console.log(match.params.gameId);
	const classes = useStyles();
	const dispatch = useDispatch();

	return (
		<Container className={classes.root}>
			<div className={classes.gameInfoRow}>
				<div className={classes.gameImageContainer}>
					<img
						src={"https://source.unsplash.com/random"}
						alt="boardgame"
						className={classes.gameImage}
					/>
				</div>
				<div className={classes.gameInfo}>
					<Typography variant="h5">Board Game Name</Typography>
					<Grid container alignItems="center" spacing={1}>
						<Grid item>
							<HiOutlineUserGroup size="30px" />
						</Grid>
						<Grid item xs>
							<Typography variant="subtitle1" className={classes.infoText}>
								2-5
							</Typography>
						</Grid>
					</Grid>
					<Grid container alignItems="center" spacing={1}>
						<Grid item>
							<FaBrain size="30px" />
						</Grid>
						<Grid item xs>
							<Typography variant="subtitle1" className={classes.infoText}>
								Easy
							</Typography>
						</Grid>
					</Grid>
					<Grid container alignItems="center" spacing={1}>
						<Grid item>
							<GiSandsOfTime size="30px" />
						</Grid>
						<Grid item xs>
							<Typography variant="subtitle1" className={classes.infoText}>
								Medium
							</Typography>
						</Grid>
					</Grid>
					<Button variant="outlined">Game Rule</Button>
				</div>
			</div>
		</Container>
	);
};

export default SingleGame;
