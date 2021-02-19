const mongoose = require("mongoose");
const Room = require("../models/room");

// get all rooms
const getAllRooms = async (req, res) => {
	try {
		const rooms = await Room.find().select("-password");
		res.status(200).json({ success: true, rooms });
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// get all rooms under specific gameId
const getGameRooms = async (req, res) => {
	const { gameId } = req.params;
	try {
		const rooms = await Room.find({ gameId }).select("-password");
		res.status(200).json({ success: true, rooms });
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// create a room for specific gameId
const createRoom = async (req, res) => {
	const roomData = req.body;
	const newRoom = new Room(roomData);
	try {
		await newRoom.save();
		res.status(201).json({ success: true, newRoom });
	} catch (error) {
		res.status(409).json({ success: false, message: error.message });
	}
};

// delete a room given roomId
const deleteRoom = async (req, res) => {
	const { id } = req.params;
	try {
		await Room.findByIdAndDelete(id);
		res
			.status(200)
			.json({ success: true, message: `Room ID ${id} successfully deleted` });
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

module.exports = {
	getAllRooms,
	getGameRooms,
	createRoom,
	deleteRoom,
};
