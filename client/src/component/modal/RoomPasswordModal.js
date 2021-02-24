import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Field } from "react-final-form";
import { useHistory } from "react-router-dom";
import { Button, IconButton, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import Modal from "./Modal";
import Input from "../form/Input";
import { closeModal } from "../../actions";
import { ROOM_PASSWORD_MODAL } from "./modalTypes";

const useStyles = makeStyles((theme) => ({
	joinBtn: {
		marginRight: theme.spacing(2),
		color: "white",
		backgroundColor: theme.palette.success.main,
		"&:hover": {
			backgroundColor: theme.palette.success.dark,
		},
	},
	textCenter: { textAlign: "center", marginTop: "16px" },
	alert: {
		padding: theme.spacing(1),
		marginBottom: theme.spacing(1),
		fontFamily: theme.typography.body1.fontFamily,
	},
	btnGroup: {
		textAlign: "center",
	},
}));

const RoomPasswordModal = () => {
	const history = useHistory();
	const classes = useStyles();
	const dispatch = useDispatch();
	const modal = useSelector((state) => state.modal);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);

	const onSubmit = (values) => {
		const { socket, room } = modal.data;
		socket.emit(
			"requestJoinRoom",
			{ name: room.name, password: values.password, gameId: room.gameId },
			(response) => {
				if (response.success) {
					dispatch(closeModal());
					history.push(`/room/${response.roomId}`);
				} else {
					setError(response.message);
					setTimeout(() => {
						setError(null);
					}, 1500);
				}
			}
		);
	};

	return (
		<Modal
			title="Join a private room"
			open={modal.show && modal.modalName === ROOM_PASSWORD_MODAL}
			cleanUp={() => setShowPassword(false)}
		>
			<Form
				onSubmit={onSubmit}
				render={({ handleSubmit, submitting }) => (
					<form onSubmit={handleSubmit}>
						<Field
							name="password"
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
						<div className={classes.btnGroup}>
							<Button
								variant="contained"
								type="submit"
								className={classes.joinBtn}
								disabled={submitting}
							>
								Join
							</Button>
							<Button
								variant="contained"
								disabled={submitting}
								onClick={() => dispatch(closeModal())}
							>
								Cancel
							</Button>
						</div>
					</form>
				)}
			/>
		</Modal>
	);
};

export default RoomPasswordModal;
