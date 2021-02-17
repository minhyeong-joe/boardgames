import React from "react";
import {
	AppBar,
	IconButton,
	makeStyles,
	Toolbar,
	Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
}));

const Header = () => {
	const classes = useStyles();
	return (
		<AppBar position="static" className={classes.root}>
			<Toolbar>
				<Typography variant="h4" className={classes.root}>
					Family Board Games
				</Typography>
				<IconButton>
					<AccountCircleIcon fontSize="large" />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
