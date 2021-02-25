// roomId: gameState pair
const gameState = {};

const initForSale = (io, room) => {
	// create initial game state
	const players = room.members.map((member) => ({
		userId: member.userId,
		username: member.username,
		isTurn: member.isTurn,
		coins: { 2: 2, 1: 14 },
		properties: [],
		currencies: [],
	}));
	const INITIAL_GAME_STATE = {
		players: players,
		openProperties: [],
		openCurrencies: [],
		remainingProperties: 2,
		remainingCurrencies: 4,
		propertyDecks: [
			{ value: 1, image: "card_img" },
			{ value: 2, image: "card_img" },
		],
		currencyDecks: [
			{ value: 0, image: "currency_img" },
			{ value: 0, image: "currency_img" },
			{ value: 2, image: "currency_img" },
			{ value: 2, image: "currency_img" },
		],
		phase: 1,
		passOrder: [],
	};
	gameState[room.id] = INITIAL_GAME_STATE;
	emitNewGameState(io, room);
};

const updateForSale = (io, room, newGameState, userId) => {
	// merge client-side's filtered change to sever-side's know-all game state
	const players = newGameState.players.map((player) => {
		// the user who just updated info (all player info should be available)
		if (player.userId === userId) {
			return player;
		}
		// other users' infos are hidden, so fetch from server-side gameState
		const serverStatePlayer = gameState[room.id].players.find(
			(serverPlayer) => serverPlayer.userId === player.userId
		);
		return {
			...serverStatePlayer,
			isTurn: player.isTurn,
			coins: serverStatePlayer.coins,
			properties: serverStatePlayer.properties,
			currencies: serverStatePlayer.currencies,
		};
	});
	// make any necessary changes (fetch hidden infos from server-side gameState)
	const updatedGameState = {
		...newGameState,
		players,
		propertyDecks: gameState[room.id].propertyDecks,
		currencyDecks: gameState[room.id].currencyDecks,
	};
	gameState[room.id] = updatedGameState;
	// emit new changes (filtered) to all members
	emitNewGameState(io, room);
};

const endForSale = (io, room, callback) => {
	gameState[room.id] = null;
	delete gameState[room.id];
	io.in(room.id).emit("updateGameState", null);
	callback();
};

// HELPERS
const emitNewGameState = (io, room) => {
	console.log("Current Server-side Game State:", gameState[room.id]);
	room.members.forEach((member) => {
		const filteredGameState = filterGameState(room.id, member.userId);
		io.to(member.socketId).emit("updateGameState", filteredGameState);
	});
};

const filterGameState = (roomId, userId) => {
	const players = gameState[roomId].players.map((player) => {
		if (player.userId === userId) {
			return player;
		}
		return {
			...player,
			coins: "hidden",
			properties: "hidden",
			currencies: "hidden",
		};
	});
	const filteredGameState = {
		...gameState[roomId],
		players: players,
		propertyDecks: "hidden",
		currencyDecks: "hidden",
	};
	console.log(`Filtered Game State sent to ${userId}:`, filteredGameState);
	return filteredGameState;
};

module.exports = { initForSale, updateForSale, endForSale };
