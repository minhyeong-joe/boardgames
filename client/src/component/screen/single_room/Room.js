import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";

let socket;

const Room = ({ match }) => {
	const history = useHistory();
	const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
	const auth = useSelector((state) => state.auth);

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit(
			"joinRoom",
			{
				username: auth?.userInfo?.username,
				userId: auth?.userInfo?._id,
				roomId: match.params.roomId,
			},
			(response) => {
				if (!response.success) {
					console.log(response.message);
					history.push("/");
				}
			}
		);

		return () => {
			socket.off();
			socket.close();
		};
	}, []);

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
