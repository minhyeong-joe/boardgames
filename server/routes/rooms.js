const express = require("express");
const router = express.Router();
const {
	getAllRooms,
	getGameRooms,
	createRoom,
	deleteRoom,
} = require("../controllers/rooms");

// GET /api/rooms/
// Get all rooms
router.get("/", getAllRooms);

// GET /api/rooms/:gameId
// Get all rooms associated with specific gameId
router.get("/:gameId", getGameRooms);

// POST /api/rooms/
// Create a room
// body: { name, password?, owner, maxOccupancy, gameId }
router.post("/", createRoom);

// DELETE /api/rooms/:id
// Delete a room
router.delete("/:id", deleteRoom);

module.exports = router;
