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

	const onSubmit = (values) => {
		console.log(values);
	};

	return (
		<Modal title="Sign Up" open={open} onClose={onClose}>
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
									value={props.input.value}
									onChange={props.input.onChange}
									InputProps={{
										endAdornment: (
											<IconButton
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										),
									}}
								/>
							)}
						</Field>
						<Field name="checkPassword">
							{(props) => (
								<Input
									type="password"
									label="Re-enter Password"
									name={props.input.name}
									value={props.input.value}
									onChange={props.input.onChange}
								/>
							)}
						</Field>

						<Button
							variant="contained"
							type="submit"
							className={classes.submitBtn}
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
