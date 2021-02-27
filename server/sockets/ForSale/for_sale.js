const {
	COINS,
	INITIAL_PROPERTIES,
	INITIAL_CURRENCIES,
} = require("./constants");

// roomId: gameState pair
const gameState = {};

const initForSale = (io) => ({ room }) => {
	// create initial game state
	let initCoins = [];
	let initPropertyDeck = [];
	let initCurrencyDeck = [];
	if (room.members.length < 5) {
		// for 3-4 players
		for (let i = 0; i < 2; i++) {
			initCoins.push(COINS[2000]);
		}
		for (let i = 0; i < 14; i++) {
			initCoins.push(COINS[1000]);
		}
		if (room.members.length === 3) {
			// for 3 players
			initPropertyDeck = removeRandomFromDeck(INITIAL_PROPERTIES, 6);
			initCurrencyDeck = removeRandomFromDeck(INITIAL_CURRENCIES, 6);
		} else {
			// for 4 players
			initPropertyDeck = removeRandomFromDeck(INITIAL_PROPERTIES, 2);
			initCurrencyDeck = removeRandomFromDeck(INITIAL_CURRENCIES, 2);
		}
	} else {
		// for 5-6 players
		for (let i = 0; i < 2; i++) {
			initCoins.push(COINS[2000]);
		}
		for (let i = 0; i < 10; i++) {
			initCoins.push(COINS[1000]);
		}
	}
	const players = room.members.map((member) => ({
		userId: member.userId,
		username: member.username,
		isTurn: member.isTurn,
		coins: initCoins,
		properties: [],
		currencies: [],
		bidding: 0,
	}));
	const INITIAL_GAME_STATE = {
		players: players,
		openProperties: initPropertyDeck.splice(0, players.length),
		openCurrencies: [],
		remainingProperties: initPropertyDeck.length,
		remainingCurrencies: initCurrencyDeck.length,
		propertyDecks: initPropertyDeck,
		currencyDecks: initCurrencyDeck,
		phase: 1,
	};
	gameState[room.id] = INITIAL_GAME_STATE;
	emitNewGameState(io, room);
};

const updateForSale = (io) => ({ room, newGameState, userId }) => {
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
			bidding: player.bidding,
		};
	});
	// phase1's new round about to start
	// give each player the property card they got
	// and get open next set of properties if there are more
	if (
		newGameState.openProperties.filter((property) => !property.taken).length ===
			0 &&
		players.find((player) => player.isTurn)
	) {
		// each player gets prop card to their possession
		players.forEach((player) => {
			const acquiredProp = newGameState.openProperties.find(
				(property) => property.taken === player.username
			);
			player.properties.push(acquiredProp);
			player.bidding = 0;
		});
		if (newGameState.remainingProperties >= players.length) {
			newGameState.openProperties = gameState[room.id].propertyDecks.splice(
				0,
				players.length
			);
			newGameState.remainingProperties =
				gameState[room.id].propertyDecks.length;
		} else {
			// create game state for phase 2
			newGameState.openCurrencies = gameState[room.id].currencyDecks.splice(
				0,
				players.length
			);
			newGameState.remainingCurrencies =
				gameState[room.id].currencyDecks.length;
			newGameState.phase = 2;
		}
	}
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

const endForSale = (io) => ({ room, callback }) => {
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

// removes random numToRemove cards from the given deck
// returns shuffled cards after numToRemove cards are removed.
const removeRandomFromDeck = (deck, numToRemove) => {
	const copy = [...deck];
	const shuffled = [];
	while (copy.length > 0) {
		const randomIndex = Math.floor(Math.random() * copy.length);
		shuffled.push(copy[randomIndex]);
		copy.splice(randomIndex, 1);
	}
	shuffled.splice(0, numToRemove);
	return shuffled;
};

module.exports = { initForSale, updateForSale, endForSale };
