import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { Button, IconButton, makeStyles, Typography } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import Modal from "./Modal";
import Input from "../form/Input";

const useStyles = makeStyles((theme) => ({
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

const SignUpModal = ({ open, onClose, onClickLogin }) => {
	const classes = useStyles();
	const [showPassword, setShowPassword] = useState(false);

	const required = (value) => (value ? undefined : "Field is Required");

	const range = (min, max) => (value) =>
		value.length >= min && value.length <= max
			? undefined
			: `Must be between ${min}-${max} characters`;

	const matching = (password) => (value) =>
		value === password ? undefined : "Passwords do not match";

	const composeValidators = (...validators) => (value) =>
		validators.reduce(
			(error, validator) => error || validator(value),
			undefined
		);

	const onSubmit = (values) => {
		console.log(values);
	};

	return (
		<Modal title="Sign Up" open={open} onClose={onClose}>
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
									<IconButton onClick={() => setShowPassword(!showPassword)}>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								),
							}}
						/>
						<Field
							name="checkPassword"
							validate={composeValidators(required, matching(values.password))}
							component={Input}
							type="password"
							label="Re-enter Password"
						/>

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
				<span className={classes.link} onClick={onClickLogin}>
					Log-In Now
				</span>
			</Typography>
		</Modal>
	);
};

export default SignUpModal;
