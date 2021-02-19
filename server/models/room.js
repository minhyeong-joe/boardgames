const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: false,
	},
	isPrivate: {
		type: Boolean,
		default: function () {
			if (this.password) {
				return true;
			} else {
				return false;
			}
		},
	},
	owner: {
		type: String,
		required: true,
	},
	maxOccupancy: {
		type: Number,
		required: true,
	},
	numMembers: {
		type: Number,
		required: false,
		default: 1,
	},
	gameId: {
		type: String,
		required: true,
	},
	isPlaying: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
