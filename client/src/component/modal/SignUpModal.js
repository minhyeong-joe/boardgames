import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { Button, IconButton, makeStyles, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import axios from "axios";

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
import { SIGNUP_MODAL } from "./modalTypes";
import { required, range, matching, composeValidators } from "./validation";

const useStyles = makeStyles((theme) => ({
	alert: {
		padding: theme.spacing(1),
		marginBottom: theme.spacing(1),
		fontFamily: theme.typography.body1.fontFamily,
	},
	submitBtn: {
		display: "block",
		marginLeft: "auto",
		marginRight: "auto",
		color: "white",
		backgroundColor: theme.palette.info.main,
		"&:hover": {
			backgroundColor: theme.palette.info.dark,
		},
	},
	textCenter: { textAlign: "center", marginTop: "16px" },
	link: {
		textDecoration: "underline",
		color: theme.palette.info.main,
		cursor: "pointer",
	},
}));

const SignUpModal = () => {
	const classes = useStyles();
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);
	const dispatch = useDispatch();
	const modal = useSelector((state) => state.modal);

	const onSubmit = async (values) => {
		const { data } = await axios.post("http://localhost/api/users", {
			username: values.username,
			password: values.password,
		});
		if (data.success) {
			dispatch(
				authenticateUser({
					username: values.username,
					password: values.password,
				})
			);
			setShowPassword(false);
			dispatch(closeModal());
		} else {
			setError(data.message);
			setTimeout(() => {
				setError(null);
			}, 1500);
		}
	};

	return (
		<Modal
			title="Sign Up"
			open={modal.show && modal.modalName === SIGNUP_MODAL}
			cleanUp={() => setShowPassword(false)}
		>
			<Form
				onSubmit={onSubmit}
				render={({ handleSubmit, values, submitting }) => (
					<form onSubmit={handleSubmit}>
						<Field
							name="username"
							validate={composeValidators(required, range(5, 12))}
							component={Input}
							type="text"
							label="Username"
						/>
						<Field
							name="password"
							validate={composeValidators(required, range(8, 16))}
							component={Input}
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
						/>
						<Field
							name="checkPassword"
							validate={composeValidators(
								required,
								matching(values.password, "Passwords do not match")
							)}
							component={Input}
							type="password"
							label="Re-enter Password"
						/>

						{error ? (
							<Alert severity="error" className={classes.alert}>
								{error}
							</Alert>
						) : null}

						<Button
							variant="contained"
							type="submit"
							className={classes.submitBtn}
							disabled={submitting}
						>
							Sign Up
						</Button>
					</form>
				)}
			/>

			<Typography variant="body1" className={classes.textCenter}>
				Already registered?{" "}
				<span
					className={classes.link}
					onClick={() => dispatch(openModal("LoginModal"))}
				>
					Log-In Now
				</span>
			</Typography>
		</Modal>
	);
};

export default SignUpModal;
