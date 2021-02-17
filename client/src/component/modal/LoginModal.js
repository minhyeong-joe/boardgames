import React, { useState } from "react";
import { Form, Field } from "react-final-form";
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
	},
	textCenter: { textAlign: "center", marginTop: "16px" },
	link: {
		textDecoration: "underline",
		color: theme.palette.info.main,
		cursor: "pointer",
	},
}));

const LoginModal = ({ open, onClose, onClickSignUp }) => {
	const classes = useStyles();
	const [showPassword, setShowPassword] = useState(false);

	const handleClose = () => {
		setShowPassword(false);
		onClose();
	};

	const required = (value) => (value ? undefined : "This field is Required");

	const onSubmit = (values) => {
		console.log(values);
	};

	return (
		<Modal title="Login" open={open} onClose={handleClose}>
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
									<IconButton onClick={() => setShowPassword(!showPassword)}>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								),
							}}
							component={Input}
						/>
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
				<span className={classes.link} onClick={onClickSignUp}>
					Sign Up Now
				</span>
			</Typography>
		</Modal>
	);
};

export default LoginModal;
