// const users = [];

// const addUser = ({ username, userId, room }) => {
// 	const user = { username, userId, room };
// 	users.push(user);
// 	return user;
// };

exports = module.exports = (io) => {
	io.sockets.on("connection", (socket) => {
		console.log("We have a new connection at test.js");
		socket.on("join", ({ username, userId, room }, callback) => {
			// const user = addUser({ username, userId, room });

			socket.emit("message", { user: "system", message: "Welcome!" });
			socket.broadcast.to(room).emit("message", {
				user: "system",
				message: `${username} has joined!`,
			});

			socket.join(room);

			callback();
		});

		socket.on("disconnect", () => {
			console.log("User has left");
		});
	});
};
