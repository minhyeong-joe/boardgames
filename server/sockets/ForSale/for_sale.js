const {
	COINS,
	INITIAL_PROPERTIES,
	INITIAL_CURRENCIES,
	TYPES,
} = require("./constants");

// roomId: gameState pair
const gameStates = {};

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
	initPropertyDeck.forEach((property) => {
		property.taken = null;
	});
	initCurrencyDeck.forEach((currency) => {
		currency.taken = null;
	});
	const players = room.members.map((member) => ({
		userId: member.userId,
		socketId: member.socketId,
		username: member.username,
		isTurn: member.isTurn,
		coins: initCoins,
		properties: [],
		currencies: [],
		bidding: 0,
		selectedProperty: null,
		selected: false,
		coinScore: null,
		currencyScore: null,
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
	gameStates[room.id] = INITIAL_GAME_STATE;
	emitNewGameState(io, room);
};

// returns next player for phase one
// returns null if no next player (AKA, the last player has just played)
const nextPlayerPhaseOne = (gameState, prevPlayer) => {
	const prevPlayerIndex = gameState.players.findIndex(
		(player) => player.userId === prevPlayer.userId
	);
	for (let i = prevPlayerIndex + 1; i < gameState.players.length; i++) {
		const player = gameState.players[i];
		if (player.bidding !== null) {
			return player;
		}
	}
	for (let i = 0; i < prevPlayerIndex; i++) {
		const player = gameState.players[i];
		if (player.bidding !== null) {
			return player;
		}
	}
	return null;
};

// returns next player for phase two
// returns null if no next player (AKA, the last player has just played)
const nextPlayerPhaseTwo = (gameState, prevPlayer) => {
	const prevPlayerIndex = gameState.players.findIndex(
		(player) => player.userId === prevPlayer.userId
	);
	for (let i = prevPlayerIndex + 1; i < gameState.players.length; i++) {
		const player = gameState.players[i];
		if (!player.selected) {
			return player;
		}
	}
	for (let i = 0; i < prevPlayerIndex; i++) {
		const player = gameState.players[i];
		if (!player.selected) {
			return player;
		}
	}
	return null;
};

// find lowest valued property that's not taken yet from openProperties
// mark it as taken by username of claimedPlayer
const claimLowestProperty = (claimedPlayer, gameState) => {
	// find lowest not taken
	const availablePropertyValues = gameState.openProperties
		.filter((property) => !property.taken)
		.map((property) => property.value);
	const lowestProperty = gameState.openProperties.find(
		(property) => property.value === Math.min(...availablePropertyValues)
	);
	lowestProperty.taken = claimedPlayer.username;
};

// refund half amount of coins rounded down to the player
const refundCoins = (player) => {
	let maxNumOf2000 =
		2 - player.coins.filter((coin) => coin.value === 2000).length;
	let refund = Math.floor(player.bidding / 2000) * 1000;
	let num2000 = 0;
	let num1000 = 0;
	while (refund >= 2000 && maxNumOf2000 > 0) {
		num2000 += 1;
		refund -= 2000;
		maxNumOf2000 -= 1;
	}
	num1000 = refund / 1000;
	for (let i = 0; i < num1000; i++) {
		player.coins.push(COINS[1000]);
	}
	for (let i = 0; i < num2000; i++) {
		player.coins.push(COINS[2000]);
	}
	player.coins.sort((a, b) => b.value - a.value);
};

// pushes taken property cards to whom they each belong
const acquireProperties = (gameState) => {
	gameState.openProperties.forEach((property) => {
		const player = gameState.players.find(
			(player) => player.username === property.taken
		);
		player.properties.push(property);
	});
};

// start a new round for phase one
// firstPlayer gets the first turn for new round, new set of property cards are open if there are any in deck,
// if deck is empty, transition gameState to Phase 2 (selling property phase)
const initNewRoundPhaseOne = (firstPlayer, gameState) => {
	firstPlayer.isTurn = true;
	gameState.players.forEach((player) => {
		player.bidding = 0;
	});
	if (gameState.remainingProperties >= gameState.players.length) {
		gameState.openProperties = gameState.propertyDecks.splice(
			0,
			gameState.players.length
		);
		gameState.remainingProperties = gameState.propertyDecks.length;
	} else {
		gameState.openProperties = [];
		gameState.remainingProperties = 0;
		gameState.openCurrencies = gameState.currencyDecks.splice(
			0,
			gameState.players.length
		);
		gameState.remainingCurrencies = gameState.currencyDecks.length;
		gameState.phase = 2;
	}
};

// claim currency cards
// player with highest selectedProperty value gets the highest currency and so on
// also returns the userId of player with highest property card (to be the first player of next round)
const claimCurrencies = (gameState) => {
	const sortedPlayers = [...gameState.players].sort(
		(a, b) => b.selectedProperty.value - a.selectedProperty.value
	);
	sortedPlayers.forEach((sortedPlayer) => {
		const availableCurrencyValues = gameState.openCurrencies
			.filter((currency) => !currency.taken)
			.map((currency) => currency.value);
		const highestCurrency = gameState.openCurrencies.find(
			(currency) =>
				currency.value === Math.max(...availableCurrencyValues) &&
				!currency.taken
		);
		highestCurrency.taken = sortedPlayer.username;
	});
	return sortedPlayers[0].userId;
};

// pushes taken currency cards to whom they each belong
const acquireCurrencies = (gameState) => {
	gameState.openCurrencies.forEach((currency) => {
		const player = gameState.players.find(
			(player) => player.username === currency.taken
		);
		player.currencies.push(currency);
	});
};

// start a new round for phase two
// firstPlayer gets the first turn for new round, new set of currency cards are open if there are any in deck,
// if deck is empty, transition gameState to Phase 3 (score and ranking)
const initNewRoundPhaseTwo = (firstPlayer, gameState) => {
	gameState.players.forEach((player) => {
		player.selected = false;
	});
	if (gameState.remainingCurrencies >= gameState.players.length) {
		firstPlayer.isTurn = true;
		gameState.openCurrencies = gameState.currencyDecks.splice(
			0,
			gameState.players.length
		);
		gameState.remainingCurrencies = gameState.currencyDecks.length;
	} else {
		gameState.openCurrencies = [];
		gameState.remainingCurrencies = 0;
		gameState.phase = 3;
	}
};

const updateForSale = (io) => ({ type, payload, room, userId }) => {
	const currentPlayer = gameStates[room.id].players.find(
		(player) => player.userId === userId
	);
	const gameState = gameStates[room.id];
	let nextPlayer;
	switch (type) {
		// PHASE 1 on player bid
		case TYPES.BID:
			const { selectedCoinsIndex } = payload;
			nextPlayer = nextPlayerPhaseOne(gameState, currentPlayer);
			// update coin and bidding state
			const selectedCoins = currentPlayer.coins.filter((coin, index) =>
				selectedCoinsIndex.includes(index)
			);
			currentPlayer.bidding += selectedCoins.reduce(
				(sum, coin) => (sum += coin.value),
				0
			);
			currentPlayer.coins = currentPlayer.coins.filter(
				(coin, index) => !selectedCoinsIndex.includes(index)
			);
			// pass turn
			currentPlayer.isTurn = false;
			nextPlayer.isTurn = true;
			emitNewGameState(io, room);
			break;
		// PHASE 1 on player pass
		case TYPES.PASS:
			nextPlayer = nextPlayerPhaseOne(gameState, currentPlayer);
			// player takes the lowest possible open property (mark it as taken)
			claimLowestProperty(currentPlayer, gameState);
			// refund half amount coins
			refundCoins(currentPlayer);
			// bidding = null to indicate this player is done for current round (no more turns)
			currentPlayer.bidding = null;
			currentPlayer.isTurn = false;
			// if only one player is left, then automatically pass that player and player gets the highest (last remaining) card
			if (
				gameState.openProperties.filter((property) => !property.taken)
					.length === 1
			) {
				nextPlayer.bidding = null;
				claimLowestProperty(nextPlayer, gameState);
				emitNewGameState(io, room);
				setTimeout(() => {
					acquireProperties(gameState);
					initNewRoundPhaseOne(nextPlayer, gameState);
					emitNewGameState(io, room);
				}, 3000);
			} else {
				nextPlayer.isTurn = true;
				emitNewGameState(io, room);
			}
			break;
		// PHASE 2 on player confirm property selection
		case TYPES.CONFIRM_PROPERTY:
			const { selectedPropertyIndex } = payload;
			nextPlayer = nextPlayerPhaseTwo(gameState, currentPlayer);
			// update selected property for the current player
			const selectedProperty = currentPlayer.properties[selectedPropertyIndex];
			currentPlayer.selectedProperty = selectedProperty;
			currentPlayer.selected = true;
			currentPlayer.properties.splice(selectedPropertyIndex, 1);
			currentPlayer.isTurn = false;
			// if last one confirmed, init new round for phase 2
			if (!nextPlayer) {
				// First show all properties used, and who claimed which currencies
				const nextId = claimCurrencies(gameState);
				nextPlayer = gameState.players.find(
					(player) => player.userId === nextId
				);
				emitNewGameState(io, room);
				setTimeout(() => {
					acquireCurrencies(gameState);
					initNewRoundPhaseTwo(nextPlayer, gameState);
					emitNewGameState(io, room);
				}, 3000);
			} else {
				nextPlayer.isTurn = true;
				emitNewGameState(io, room);
			}
			break;
	}
};

const endForSale = (io) => ({ room }) => {
	gameStates[room.id] = null;
	delete gameStates[room.id];
	io.in(room.id).emit("updateGameState", null);
};

// HELPERS
const emitNewGameState = (io, room) => {
	console.log("Current Server-side Game State:", gameStates[room.id]);
	room.members.forEach((member) => {
		const filteredGameState = filterGameState(room.id, member.userId);
		io.to(member.socketId).emit("updateGameState", filteredGameState);
	});
};

const filterGameState = (roomId, userId) => {
	const players = gameStates[roomId].players.map((player) => {
		if (player.userId === userId) {
			return player;
		}
		// if phase 2 and everyone chose property cards, return selectedProperties without filtering
		const showSelectedProperty = gameStates[roomId].players.every(
			(player) => player.selected
		);
		return {
			...player,
			coins: "hidden",
			properties: "hidden",
			currencies: "hidden",
			selectedProperty: showSelectedProperty
				? player.selectedProperty
				: "hidden",
		};
	});
	const filteredGameState = {
		...gameStates[roomId],
		players: players,
		propertyDecks: "hidden",
		currencyDecks: "hidden",
	};
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
