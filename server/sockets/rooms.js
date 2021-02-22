const { v4: uuidv4 } = require("uuid");

// userRooms is used to map user's socket id to the room id
// This makes room search from socket id efficient and fast
const userRooms = {};

// rooms are all game rooms not including the lobby that displays rooms for specific games
// rooms contain:
// id: uuid
// name: String room name
// memebers: [ { userId: ID generated by MongoDB, username: name of user, isOwner: Boolean, socketId: ID generated by socketIO } ]
// gameState: initially null, but receive corresponding gameState from client component (gameState has many forms based on game type)
// gameId: uuid
// password: String or null
// maxOccupancy: number of max occupancy
// isPrivate: automatically set to true if password is provided, else false
let rooms = [];

exports = module.exports = (io) => {
	io.on("connection", (socket) => {
		console.log(`socket connected: ${socket.id}`);

		// on user joinning the lobby (page that displays all the rooms for a game)
		socket.on("joinLobby", (payload, callback) => {
			const { gameId } = payload;
			socket.join(`lobby-${gameId}`);
			callback(getRooms(gameId));
		});

		// on user create a room via create_room_modal
		socket.on("createRoom", (payload, callback) => {
			const roomId = uuidv4();
			const newRoom = {
				...payload, // { name, password, maxOccupancy, gameId }
				gameState: null,
				isPrivate: payload.password ? true : false,
				id: roomId,
				members: [],
			};
			rooms.push(newRoom);
			callback(roomId);
		});

		// on user joining the game room
		// Note: after user creates a room, he/she will be redirected to the room and thus "joinRoom" and be added as the first member AKA owner.
		socket.on("joinRoom", (payload, callback) => {
			const { username, userId, roomId, accessGranted } = payload;
			const currentRoom = rooms.find((room) => room.id === roomId);
			// catch invalid accesses such as max occupied or password bypass through direct url typing, etc.
			if (!currentRoom) {
				callback({ success: false, message: "Room does not exist" });
				return;
			}
			if (currentRoom.members.length === currentRoom.maxOccupancy) {
				callback({ success: false, message: "The room is full" });
				return;
			}
			// add new user (check if owner) to the room
			const isOwner = currentRoom.members.length === 0;
			currentRoom.members.push({
				username,
				userId,
				isOwner,
				socketId: socket.id,
			});
			// make a key pair of {socket id: room id}
			userRooms[socket.id] = roomId;
			callback({ success: true });
			socket.broadcast
				.to(`lobby-${currentRoom.gameId}`)
				.emit("loadRooms", { rooms: getRooms(currentRoom.gameId) });
		});

		socket.on("disconnect", () => {
			console.log(`socket disconnected: ${socket.id}`);

			userExit(socket);
		});
	});
};

// returns all the rooms that are of specific game type (determined by gameId)
const getRooms = (gameId) => {
	return rooms
		.filter((room) => room.gameId === gameId) // find all rooms under specific gameId
		.map(({ password, ...rest }) => rest); // remove password from room objects
};

// user leaves a room (either manually or disconnecting through back navigation or browser exit)
const userExit = (socket) => {
	const roomId = userRooms[socket.id];
	if (roomId) {
		// user was at a game room and disconnected
		const room = rooms.find((room) => room.id === roomId);
		// remove user from the room
		room.members = room.members.filter(
			(member) => member.socketId !== socket.id
		);
		// remove {socket id: room id} pair
		delete userRooms[socket.id];
		// if everyone leaves, destroy room
		if (room.members.length === 0) {
			rooms = rooms.filter((room) => room.id !== roomId);
		} else {
			// guarantees the first member is always the owner
			room.members[0].isOwner = true;
		}
		socket.broadcast.to(`lobby-${room.gameId}`).emit("loadRooms", {
			rooms: getRooms(room.gameId),
		});
	}
};
