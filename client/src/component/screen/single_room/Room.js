import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

let socket;

const Room = ({ match }) => {
	const ENDPOINT = "localhost";
	const auth = useSelector((state) => state.auth);

	useEffect(() => {
		socket = io(ENDPOINT);
		console.log(socket);

		socket.emit(
			"join",
			{
				username: auth.userInfo.username,
				userId: auth.userInfo._id,
				room: match.params.roomId,
			},
			() => {}
		);

		return () => {
			socket.off();
		};
	}, [
		ENDPOINT,
		auth.userInfo._id,
		auth.userInfo.username,
		match.params.roomId,
	]);

	useEffect(() => {
		socket.on("message", (message) => {
			console.log(message);
		});
	});

	return <div>Room</div>;
};

export default Room;
