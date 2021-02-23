import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		height: "100%",
		backgroundColor: theme.palette.secondary.main,
	},
	[theme.breakpoints.down("xs")]: {
		root: {
			height: "80vh",
		},
	},
}));

const GameArea = () => {
	const classes = useStyles();
	return <div className={classes.root}>GameArea</div>;
};

export default GameArea;
