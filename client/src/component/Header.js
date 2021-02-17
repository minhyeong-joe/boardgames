import React, { useState } from "react";
import {
	AppBar,
	IconButton,
	makeStyles,
	Toolbar,
	Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Link } from "react-router-dom";

import LoginModal from "./modal/LoginModal";
import SignUpModal from "./modal/SignUpModal";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		background: theme.palette.primary.mainGradient,
	},
	logo: {
		textDecoration: "none",
		display: "block",
		color: "inherit",
		marginRight: "auto",
	},
}));

const Header = () => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [modal, setModal] = useState("login");

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setModal("login");
	};

	return (
		<AppBar position="static" className={classes.root}>
			<Toolbar>
				<Link to="/" className={classes.logo}>
					<Typography variant="h4">Family Board Games</Typography>
				</Link>
				<IconButton onClick={handleOpen}>
					<AccountCircleIcon fontSize="large" />
				</IconButton>
			</Toolbar>
			{/* Modal */}
			{modal === "login" ? (
				<LoginModal
					open={open}
					onClose={handleClose}
					onClickSignUp={() => setModal("signup")}
				/>
			) : (
				<SignUpModal
					open={open}
					onClose={handleClose}
					onClickLogin={() => setModal("login")}
				/>
			)}
		</AppBar>
	);
};

export default Header;
