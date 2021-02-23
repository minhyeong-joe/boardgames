import React from "react";
import {
	Grid,
	makeStyles,
	Menu,
	MenuItem,
	Typography,
} from "@material-ui/core";
import { FaCrown } from "react-icons/fa";
import FirstIcon from "../../../assets/image/first_turn.png";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		height: "300px",
		width: "240px",
		padding: theme.spacing(1),
		boxShadow: `0 0 5px ${theme.palette.grey[500]}`,
		overflowY: "auto",
		display: "inline-block",
		overflowWrap: "anywhere",
		"&::-webkit-scrollbar": {
			width: "10px",
		},
		"&::-webkit-scrollbar-track": {
			boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
			// -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
		},
		"&::-webkit-scrollbar-thumb": {
			backgroundColor: theme.palette.grey[700],
			outline: "1px solid slategray",
		},
	},
	firstIcon: {
		height: "25px",
		verticalAlign: "middle",
		marginLeft: theme.spacing(1),
	},
	crown: {
		verticalAlign: "middle",
		marginLeft: theme.spacing(1),
		color: "#fbd688",
	},
	[theme.breakpoints.down("xs")]: {
		root: {
			width: "100%",
			height: "200px",
		},
	},
}));

const UserList = () => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<MenuItem>
				<Typography variant="body2" style={{ fontSize: "1.2rem" }}>
					Owner
					<FaCrown className={classes.crown} />
					<img src={FirstIcon} className={classes.firstIcon} alt="first" />
				</Typography>
			</MenuItem>
			<MenuItem>
				<Typography variant="body2" style={{ fontSize: "1.2rem" }}>
					user123
				</Typography>
			</MenuItem>
			<MenuItem>
				<Typography variant="body2" style={{ fontSize: "1.2rem" }}>
					testuser
				</Typography>
			</MenuItem>
			<MenuItem>
				<Typography variant="body2" style={{ fontSize: "1.2rem" }}>
					abcdefghijklmno
					<FaCrown className={classes.crown} />
					<img src={FirstIcon} className={classes.firstIcon} alt="first" />
				</Typography>
			</MenuItem>
		</div>
	);
};

export default UserList;
