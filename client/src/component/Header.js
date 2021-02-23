import React, { useEffect, useState } from "react";
import {
	AppBar,
	Button,
	IconButton,
	makeStyles,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getUserInfo, logoutUser, openModal, showFlash } from "../actions";
import { LOGIN_MODAL } from "./modal/modalTypes";

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
	const [anchorEl, setAnchorEl] = useState(null);
	const dispatch = useDispatch();
	const auth = useSelector((state) => state.auth);

	// on refresh, the redux store will get updated from session
	useEffect(() => {
		dispatch(getUserInfo());
	}, []);

	const handleModalOpen = () => {
		dispatch(openModal({ modalName: LOGIN_MODAL }));
	};

	const handleMenuOpen = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		dispatch(logoutUser());
		dispatch(
			showFlash({
				message: "You are now Signed Out",
				duration: 2000,
			})
		);
		setAnchorEl(null);
	};
	return (
		<AppBar position="static" className={classes.root}>
			<Toolbar>
				<Link to="/" className={classes.logo}>
					<Typography variant="h4">Family Board Games</Typography>
				</Link>
				{auth.isLoggedIn ? (
					<>
						<IconButton onClick={handleMenuOpen}>
							<AccountCircleIcon fontSize="large" />
						</IconButton>
						<Typography variant="body1" color="textPrimary">
							{auth.userInfo.username}
						</Typography>
						<Menu
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
							getContentAnchorEl={null}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "center",
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "center",
							}}
						>
							<MenuItem>
								<Typography variant="body1">Profile</Typography>
							</MenuItem>
							<MenuItem>
								<Typography variant="body1">Friends</Typography>
							</MenuItem>
							<hr />
							<MenuItem>
								<Typography variant="body1" onClick={handleLogout}>
									Logout
								</Typography>
							</MenuItem>
						</Menu>
					</>
				) : (
					<Button variant="outlined" onClick={handleModalOpen}>
						Login
					</Button>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Header;
