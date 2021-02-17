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

	const onSubmit = (values) => {
		console.log(values);
	};

	return (
		<Modal title="Login" open={open} onClose={handleClose}>
			<Form
				onSubmit={onSubmit}
				render={({ handleSubmit }) => (
					<form onSubmit={handleSubmit}>
						<Field name="username">
							{(props) => (
								<Input
									type="text"
									label="Username"
									name={props.input.name}
									value={props.input.value}
									onChange={props.input.onChange}
								/>
							)}
						</Field>
						<Field name="password">
							{(props) => (
								<Input
									type={showPassword ? "text" : "password"}
									label="Password"
									name={props.input.name}
									InputProps={{
										endAdornment: (
											<IconButton
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										),
									}}
									value={props.input.value}
									onChange={props.input.onChange}
								/>
							)}
						</Field>
						<Button
							variant="contained"
							color="secondary"
							type="submit"
							className={classes.submitBtn}
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
