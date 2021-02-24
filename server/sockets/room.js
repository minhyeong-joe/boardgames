const { v4: uuidv4 } = require("uuid");

// joins specific game lobby and runs callback with all rooms that are created in the specific lobby
const joinLobby = (socket, rooms, userRooms) => (payload, callback) => {
	const { gameId } = payload;
	const roomName = `lobby-${gameId}`;
	socketJoinRoom(socket, roomName, userRooms);
	callback(getRooms(gameId, rooms));
};

// create an empty room in the specific game lobby
const createRoom = (rooms) => (payload, callback) => {
	const { name, password, maxOccupancy, gameId } = payload;
	const roomId = uuidv4();
	if (rooms.find((room) => room.name === name)) {
		// if room name exists
		callback({ success: false, message: "Room name already in use" });
		return;
	}
	rooms.push({
		...payload,
		gameState: null,
		isPrivate: Boolean(password),
		id: roomId,
		members: [],
	});
	callback({ success: true, roomId });
};

// User requests to join a room by clicking the room at the lobby
const requestJoinRoom = (rooms) => (payload, callback) => {
	const { name, password } = payload;
	const roomToJoin = rooms.find((room) => room.name === name);
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
const joinRoom = (socket, rooms, userRooms) => (payload, callback) => {
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
	if (currentRoom.gameState) {
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
	socketJoinRoom(socket, roomId, userRooms);
	callback({ success: true, room: currentRoom });
	// update room info at the lobby
	socket.broadcast
		.to(`lobby-${currentRoom.gameId}`)
		.emit("loadRooms", { rooms: getRooms(currentRoom.gameId, rooms) });
	// update room info in the room
	socket.broadcast.to(roomId).emit("userJoinsRoom", { room: currentRoom });
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
const sendMessage = (io, socket, userRooms) => (payload) => {
	const { senderId, sendername, content } = payload;
	// find the room this user is in
	const roomId = userRooms[socket.id];
	io.in(roomId).emit("message", { senderId, sendername, content });
};

// On user leaves a room
const userExit = (socket, rooms, userRooms) => {
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
					rooms.indexOf((room) => room.id === roomName),
					1
				);
			} else {
				// guarantees the first member is always the owner
				room.members[0].isOwner = true;
			}
			// update room occupancy to lobby
			socket.broadcast.to(`lobby-${room.gameId}`).emit("loadRooms", {
				rooms: getRooms(room.gameId, rooms),
			});
			// broadcast new room state to the room
			socket.broadcast.to(roomName).emit("userExitsRoom", { room });
			socket.broadcast.to(roomName).emit("log", {
				timestamp: Date.now(),
				message: `${username} left the room`,
			});
		}
		socketLeaveRoom(socket, userRooms);
	}
};

// HELPERS
// returns all the rooms in the specific game lobby (determined by gameId)
const getRooms = (gameId, rooms) => {
	return rooms
		.filter((room) => room.gameId === gameId) // find all rooms under specific gameId
		.map(({ password, id, ...rest }) => rest); // remove password from room objects
};

const socketJoinRoom = (socket, roomName, userRooms) => {
	socket.join(roomName);
	userRooms[socket.id] = roomName;
};

const socketLeaveRoom = (socket, userRooms) => {
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
};
