const { v4: uuidv4 } = require("uuid");
const { endForSale } = require("./ForSale/for_sale");

// userRooms is used to map user's socket id to the room id
// This makes room search from socket id efficient and fast
const userRooms = {};

// rooms are all game rooms not including the lobby that displays rooms for specific games
// rooms contain:
// id: uuid
// name: String room name
// memebers: [ { userId: ID generated by MongoDB, username: name of user, isOwner: Boolean, socketId: ID generated by socketIO, isTurn: whether this member is first to go next round } ]
// isPlaying: whether the game is playing
// gameId: uuid
// password: String or null
// maxOccupancy: number of max occupancy
// isPrivate: automatically set to true if password is provided, else false
const rooms = [];

// joins specific game lobby and runs callback with all rooms that are created in the specific lobby
const joinLobby = (socket) => (payload, callback) => {
	const { gameId } = payload;
	const roomName = `lobby-${gameId}`;
	socketJoinRoom(socket, roomName);
	callback(getRooms(gameId));
};

// create an empty room in the specific game lobby
const createRoom = () => (payload, callback) => {
	const { name, password, maxOccupancy, gameId } = payload;
	const roomId = uuidv4();
	if (rooms.find((room) => room.name === name && room.gameId === gameId)) {
		// if room name exists
		callback({ success: false, message: "Room name already in use" });
		return;
	}
	rooms.push({
		...payload,
		isPlaying: false,
		isPrivate: Boolean(password),
		id: roomId,
		members: [],
	});
	callback({ success: true, roomId });
};

// User requests to join a room by clicking the room at the lobby
const requestJoinRoom = () => (payload, callback) => {
	const { name, password, gameId } = payload;
	const roomToJoin = rooms.find(
		(room) => room.name === name && room.gameId === gameId
	);
	// catch invalid join room requests
	if (!roomToJoin) {
		callback({ success: false, message: "Room does not exist" });
		return;
	}
	if (roomToJoin.members.length === roomToJoin.maxOccupancy) {
		callback({ success: false, message: "Room is already full" });
		return;
	}
	if (roomToJoin.isPrivate && password !== roomToJoin.password) {
		callback({ success: false, message: "Incorrect Password" });
		return;
	}
	callback({ success: true, roomId: roomToJoin.id });
};

// At the single room page, On user joining the game room
const joinRoom = (socket) => (payload, callback) => {
	const { username, userId, roomId } = payload;
	const currentRoom = rooms.find((room) => room.id === roomId);
	// catch invalid accesses such as max occupied or password bypass through direct url typing, etc.
	// Only for direct url typing
	if (!currentRoom) {
		callback({ success: false, message: "Room does not exist" });
		return;
	}
	if (currentRoom.members.length === currentRoom.maxOccupancy) {
		callback({ success: false, message: "The room is full" });
		return;
	}
	if (currentRoom.isPlaying) {
		callback({ success: false, message: "A game is in progress" });
		return;
	}
	if (
		rooms.find((room) =>
			room.members.some((member) => member.userId === userId)
		)
	) {
		callback({ success: false, message: "Duplicate user session" });
		return;
	}
	// add new user to the room (first one is always going to be the owner and first turn)
	const firstPerson = currentRoom.members.length === 0;
	const newMember = {
		username,
		userId,
		socketId: socket.id,
		isOwner: firstPerson,
		isTurn: firstPerson,
	};
	currentRoom.members.push(newMember);
	socketJoinRoom(socket, roomId);
	callback({ success: true, room: currentRoom });
	// update room info at the lobby
	socket.broadcast
		.to(`lobby-${currentRoom.gameId}`)
		.emit("loadRooms", { rooms: getRooms(currentRoom.gameId) });
	// update room info in the room
	socket.broadcast.to(roomId).emit("updateRoom", { room: currentRoom });
	socket.emit("log", {
		timestamp: Date.now(),
		message: "Welcome to the room",
	});
	socket.broadcast.to(roomId).emit("log", {
		timestamp: Date.now(),
		message: `${newMember.username} has joined the room`,
	});
};

// On user sends message
const sendMessage = (io, socket) => (payload) => {
	const { senderId, sendername, content } = payload;
	// find the room this user is in
	const roomId = userRooms[socket.id];
	io.in(roomId).emit("message", { senderId, sendername, content });
};

const moveTurn = (io) => (payload) => {
	const { roomId } = payload;
	const roomToModify = rooms.find((room) => room.id === roomId);
	const currentFirstPlayerIndex = roomToModify.members.findIndex(
		(member) => member.isTurn
	);
	roomToModify.members[currentFirstPlayerIndex].isTurn = false;
	if (currentFirstPlayerIndex + 1 >= roomToModify.members.length) {
		roomToModify.members[0].isTurn = true;
	} else {
		roomToModify.members[currentFirstPlayerIndex + 1].isTurn = true;
	}
	console.log(`move Turn at ${roomId} from index ${currentFirstPlayerIndex}`);
	console.log(roomToModify);
	io.in(roomId).emit("updateRoom", { room: roomToModify });
};

const startGame = (io, socket) => (payload) => {
	const { roomId } = payload;
	const room = rooms.find((room) => room.id === roomId);
	room.isPlaying = true;
	// update room info at the lobby
	socket.broadcast
		.to(`lobby-${room.gameId}`)
		.emit("loadRooms", { rooms: getRooms(room.gameId) });
	// update room info in the room
	socket.broadcast.to(roomId).emit("updateRoom", { room });
	io.in(roomId).emit("log", {
		timestamp: Date.now(),
		message: "Game has started",
	});
};

// On user leaves a room
const userExit = (io, socket) => {
	const roomName = userRooms[socket.id];
	if (roomName) {
		const room = rooms.find((room) => room.id === roomName);
		if (room) {
			// user disconnects from game room
			// get the username of the user that's leaving
			const username = room.members.find(
				(member) => member.socketId === socket.id
			).username;
			// if user is the first-turn next round, yield first-turn to next player
			const playerIndex = room.members.findIndex(
				(member) => member.socketId === socket.id
			);
			if (room.members[playerIndex].isTurn) {
				if (playerIndex + 1 >= room.members.length) {
					room.members[0].isTurn = true;
				} else {
					room.members[playerIndex + 1].isTurn = true;
				}
			}
			// remove user from the room
			room.members = room.members.filter(
				(member) => member.socketId !== socket.id
			);
			// if everyone leaves, destroy room
			if (room.members.length === 0) {
				rooms.splice(
					rooms.findIndex((room) => room.id === roomName),
					1
				);
			} else {
				// guarantees the first member is always the owner
				room.members[0].isOwner = true;
			}
			// update room occupancy to lobby
			socket.broadcast.to(`lobby-${room.gameId}`).emit("loadRooms", {
				rooms: getRooms(room.gameId),
			});
			// broadcast new room state to the room
			socket.broadcast.to(roomName).emit("updateRoom", { room });
			socket.broadcast.to(roomName).emit("log", {
				timestamp: Date.now(),
				message: `${username} left the room`,
			});

			// if game was in progress
			if (room.isPlaying) {
				room.isPlaying = false;
				switch (room.gameId) {
					case "4d6d6d26-3baa-4782-b06c-d5fb15f43e2b":
						endForSale(io)(room);
						break;

					default:
				}
			}
		}
		socketLeaveRoom(socket);
	}
};

// HELPERS
// returns all the rooms in the specific game lobby (determined by gameId)
const getRooms = (gameId) => {
	return rooms
		.filter((room) => room.gameId === gameId) // find all rooms under specific gameId
		.map(({ password, id, ...rest }) => rest); // remove password from room objects
};

const socketJoinRoom = (socket, roomName) => {
	socket.join(roomName);
	userRooms[socket.id] = roomName;
};

const socketLeaveRoom = (socket) => {
	const roomName = userRooms[socket.id];
	socket.leave(roomName);
	delete userRooms[socket.id];
};

module.exports = {
	joinLobby,
	createRoom,
	requestJoinRoom,
	joinRoom,
	userExit,
	sendMessage,
	moveTurn,
	startGame,
};
