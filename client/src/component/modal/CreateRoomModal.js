import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Field } from "react-final-form";
import { useHistory } from "react-router-dom";
import {
	Button,
	IconButton,
	makeStyles,
	MenuItem,
	Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import Modal from "./Modal";
import Input from "../form/Input";
import { closeModal } from "../../actions";
import { CREATE_ROOM_MODAL } from "./modalTypes";
import { required, range, composeValidators } from "./validation";
import Select from "../form/Select";
import GAMES from "../../games/games";
import { ROOM_API } from "../../axios";

const useStyles = makeStyles((theme) => ({
	createBtn: {
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

const CreateRoomModal = () => {
	const history = useHistory();
	const classes = useStyles();
	const dispatch = useDispatch();
	const modal = useSelector((state) => state.modal);
	const auth = useSelector((state) => state.auth);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);
	const game = GAMES.find((game) => game.id === modal?.data?.gameId);

	const onSubmit = async (values) => {
		const { gameId, socket } = modal.data;
		socket.emit(
			"createRoom",
			{
				...values,
				gameId,
			},
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
		// const { data } = await ROOM_API.post("/", {
		// 	owner: auth.userInfo.username,
		// 	gameId: modal.data.gameId,
		// 	...values,
		// });
		// if (data.success) {
		// dispatch(closeModal());
		// history.push(`/room/${data.newRoom._id}`);
		// }
	};

	const createOption = (min, max) => {
		let arr = [];
		for (let i = min; i <= max; i++) {
			arr.push({ value: i, label: i });
		}
		return arr;
	};

	return (
		<Modal
			title="Create a Room"
			open={modal.show && modal.modalName === CREATE_ROOM_MODAL}
			cleanUp={() => setShowPassword(false)}
		>
			<Form
				onSubmit={onSubmit}
				render={({ handleSubmit, submitting }) => (
					<form onSubmit={handleSubmit}>
						<Field
							name="name"
							validate={composeValidators(required, range(5, 20))}
							type="text"
							label="Room Name"
							component={Input}
						/>
						<Field
							name="maxOccupancy"
							label="Max Occupancy"
							component={Select}
							defaultValue={game.max}
						>
							{createOption(game.min, game.max).map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</Field>
						<Field
							name="password"
							type={showPassword ? "text" : "password"}
							label="Password (optional)"
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
								className={classes.createBtn}
								disabled={submitting}
							>
								Create
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

export default CreateRoomModal;
