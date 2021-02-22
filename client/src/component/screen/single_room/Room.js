import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import { closeModal, openModal, showFlash } from "../../../actions";
import { LOGIN_MODAL } from "../../modal/modalTypes";

let socket;

const Room = ({ match }) => {
	const history = useHistory();
	const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
	const auth = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		socket = io(ENDPOINT);
		if (auth.isLoggedIn) {
			dispatch(closeModal());
			socket.emit(
				"joinRoom",
				{
					username: auth.userInfo.username,
					userId: auth.userInfo?._id,
					roomId: match.params.roomId,
				},
				(response) => {
					if (!response.success) {
						dispatch(
							showFlash({
								message: response.message,
								duration: 1500,
								severity: "error",
							})
						);
						history.push("/");
					}
				}
			);
		} else {
			dispatch(openModal({ modalName: LOGIN_MODAL }));
		}

		return () => {
			socket.off();
			socket.close();
		};
	}, [auth]);

	useEffect(() => {
		socket.on("message", (message) => {
			console.log(message);
		});

		return () => {
			socket.off();
			socket.close();
		};
	}, []);

	return <div>Room</div>;
};

export default Room;
