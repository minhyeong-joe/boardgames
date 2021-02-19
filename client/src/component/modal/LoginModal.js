import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { Button, IconButton, makeStyles, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import Modal from "./Modal";
import Input from "../form/Input";
import { useDispatch, useSelector } from "react-redux";
import {
	authenticateUser,
	closeModal,
	loginUser,
	openModal,
	showFlash,
} from "../../actions";
import { LOGIN_MODAL, SIGNUP_MODAL } from "./modalTypes";
import { required } from "./validation";

const useStyles = makeStyles((theme) => ({
	submitBtn: {
		display: "block",
		marginLeft: "auto",
		marginRight: "auto",
		color: "white",
	},
	textCenter: { textAlign: "center", marginTop: "16px" },
	alert: {
		padding: theme.spacing(1),
		marginBottom: theme.spacing(1),
		fontFamily: theme.typography.body1.fontFamily,
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
		dispatch(authenticateUser(values));
	};

	useEffect(() => {
		if (auth.success) {
			dispatch(loginUser());
			dispatch(
				showFlash({
					message: "Login Successful!",
					duration: 2000,
				})
			);
			setShowPassword(false);
			dispatch(closeModal());
		} else {
			setError(auth.message);
			setTimeout(() => {
				setError(null);
			}, 1500);
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
							<Alert severity="error" className={classes.alert}>
								{error}
							</Alert>
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
					onClick={() => dispatch(openModal({ modalName: SIGNUP_MODAL }))}
				>
					Sign Up Now
				</span>
			</Typography>
		</Modal>
	);
};

export default LoginModal;
