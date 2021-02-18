import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import {
	Button,
	IconButton,
	makeStyles,
	Paper,
	Typography,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import Modal from "./Modal";
import Input from "../form/Input";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, loginUser, openModal } from "../../actions";
import { LOGIN_MODAL } from "./modalTypes";
import { required } from "./validation";

const useStyles = makeStyles((theme) => ({
	submitBtn: {
		display: "block",
		marginLeft: "auto",
		marginRight: "auto",
		color: "white",
	},
	textCenter: { textAlign: "center", marginTop: "16px" },
	errorMessage: {
		textAlign: "center",
		padding: theme.spacing(1),
		backgroundColor: theme.palette.error.main,
		color: "white",
		marginBottom: theme.spacing(1),
	},
	link: {
		textDecoration: "underline",
		color: theme.palette.info.main,
		cursor: "pointer",
	},
}));

const LoginModal = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const auth = useSelector((state) => state.auth);
	const modal = useSelector((state) => state.modal);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);

	const onSubmit = (values) => {
		dispatch(loginUser(values));
	};

	useEffect(() => {
		if (!auth.success) {
			setError(auth.message);
			setTimeout(() => {
				setError(null);
			}, 1500);
		}
		if (auth.isLoggedIn) {
			setShowPassword(false);
			dispatch(closeModal());
		}
	}, [auth, dispatch]);

	return (
		<Modal
			title="Login"
			open={modal.show && modal.modalName === LOGIN_MODAL}
			cleanUp={() => setShowPassword(false)}
		>
			<Form
				onSubmit={onSubmit}
				render={({ handleSubmit, submitting }) => (
					<form onSubmit={handleSubmit}>
						<Field
							name="username"
							validate={required}
							type="text"
							label="Username"
							component={Input}
						/>
						<Field
							name="password"
							validate={required}
							type={showPassword ? "text" : "password"}
							label="Password"
							InputProps={{
								endAdornment: (
									<IconButton
										onClick={() => setShowPassword(!showPassword)}
										tabIndex={-1}
									>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								),
							}}
							component={Input}
						/>
						{error ? (
							<Paper className={classes.errorMessage}>
								<Typography variant="body1">{error}</Typography>
							</Paper>
						) : null}
						<Button
							variant="contained"
							color="secondary"
							type="submit"
							className={classes.submitBtn}
							disabled={submitting}
						>
							Login
						</Button>
					</form>
				)}
			/>
			<Typography variant="body1" className={classes.textCenter}>
				Not registered?{" "}
				<span
					className={classes.link}
					onClick={() => dispatch(openModal("SignupModal"))}
				>
					Sign Up Now
				</span>
			</Typography>
		</Modal>
	);
};

export default LoginModal;
