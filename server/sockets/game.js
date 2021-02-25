const FOR_SALE = "For Sale";

const {
	initForSale,
	updateForSale,
	endForSale,
} = require("./ForSale/for_sale");

const initGame = (io) => (payload) => {
	const { gameName, room } = payload;
	switch (gameName) {
		case FOR_SALE:
			initForSale(io, room);
			break;
		default:
	}
};

const updateGame = (io) => (payload) => {
	const { gameName, room, newGameState, userId } = payload;
	switch (gameName) {
		case FOR_SALE:
			updateForSale(io, room, newGameState, userId);
			break;

		default:
	}
};

const endGame = (io) => (payload, callback) => {
	const { gameName, room } = payload;
	switch (gameName) {
		case FOR_SALE:
			endForSale(io, room, callback);
			break;

		default:
	}
};

module.exports = { initGame, updateGame, endGame };
