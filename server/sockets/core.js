const {
	initForSale,
	updateForSale,
	endForSale,
} = require("./ForSale/for_sale");
const {
	joinLobby,
	createRoom,
	requestJoinRoom,
	joinRoom,
	sendMessage,
	userExit,
	moveTurn,
} = require("./room");

exports = module.exports = (io) => {
	io.on("connection", (socket) => {
		console.log(`socket connected: ${socket.id}`);

		// on user joinning the lobby (page that displays all the rooms for a game)
		socket.on("joinLobby", joinLobby(socket));

		// ********** BASIC ROOM OPERATIONS ***************

		// on user create a room via create_room_modal
		socket.on("createRoom", createRoom());

		socket.on("requestJoinRoom", requestJoinRoom());

		// on user joining the game room
		// Note: after user creates a room, he/she will be redirected to the room and thus "joinRoom" and be added as the first member AKA owner.
		socket.on("joinRoom", joinRoom(socket));

		// on user send message
		socket.on("sendMessage", sendMessage(io, socket));

		// on game end, turn transfers to the next player
		socket.on("moveTurn", moveTurn(io));

		// ************* GAME OPERATIONS ******************
		// For Sale
		socket.on("initForSale", initForSale(io));

		socket.on("updateForSale", updateForSale(io));

		socket.on("endForSale", endForSale(io));

		socket.on("disconnect", () => {
			console.log(`socket disconnected: ${socket.id}`);

			userExit(socket);
		});
	});
};
