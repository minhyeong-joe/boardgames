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
			bidding: player.bidding,
			selected: player.selected,
		};
	});
	// phase1's new round about to start
	// give each player the property card they got
	// and open next set of properties if there are more
	if (
		newGameState.phase === 1 &&
		newGameState.openProperties.every((property) => property.taken) &&
		players.some((player) => player.isTurn)
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
			(newGameState.openProperties = []),
				(newGameState.remainingProperties = 0);

			newGameState.openCurrencies = gameState[room.id].currencyDecks.splice(
				0,
				players.length
			);
			newGameState.remainingCurrencies =
				gameState[room.id].currencyDecks.length;
			newGameState.phase = 2;
		}
	}
	// phase2's new round about to start
	// update currency card's taken to the user with the highest property
	if (newGameState.phase === 2 && players.every((player) => player.selected)) {
		console.log("Phase 2 round change - take currencies");
		const sortedPlayers = [...players].sort(
			(a, b) => b.selectedProperty.value - a.selectedProperty.value
		);
		sortedPlayers.forEach((sortedPlayer) => {
			const currencies = newGameState.openCurrencies
				.filter((currency) => !currency.taken)
				.map((currency) => currency.value);
			const maxCurrencyCard = newGameState.openCurrencies.find(
				(currencyCard) =>
					currencyCard.value === Math.max(...currencies) && !currencyCard.taken
			);
			maxCurrencyCard.taken = sortedPlayer.username;
		});
	}
	// phase 2's new round begins
	// draw new set of currency cards if there are more
	if (
		newGameState.phase === 2 &&
		gameState[room.id].openCurrencies.length > 0 &&
		gameState[room.id].openCurrencies.every((currency) => currency.taken)
	) {
		console.log("Start the new round");
		// whoever used highest property card becomes first turn in next round
		const sortedPlayers = [...players].sort(
			(a, b) => b.selectedProperty.value - a.selectedProperty.value
		);
		// each player gets currency card to their possession
		players.forEach((player) => {
			const acquiredCurrency = newGameState.openCurrencies.find(
				(currency) => currency.taken === player.username
			);
			player.currencies.push(acquiredCurrency);
			player.selectedProperty = null;
			player.selected = false;
			if (player.userId === sortedPlayers[0].userId) {
				player.isTurn = true;
			}
		});
		if (newGameState.remainingCurrencies >= players.length) {
			newGameState.openCurrencies = gameState[room.id].currencyDecks.splice(
				0,
				players.length
			);
			newGameState.remainingCurrencies =
				gameState[room.id].currencyDecks.length;
		} else {
			// create game state for phase 3
			(newGameState.openCurrencies = []),
				(newGameState.remainingCurrencies = 0);
			newGameState.phase = 3;
			players.forEach((player) => {
				const coinScore =
					player.coins.reduce((sum, coin) => (sum += coin.value), 0) / 1000;
				const currencyScore =
					player.currencies.reduce(
						(sum, currency) => (sum += currency.value),
						0
					) / 1000;
				player.coinScore = coinScore;
				player.currencyScore = currencyScore;
			});
		}
	}
	const updatedGameState = {
		...newGameState,
		players,
		propertyDecks: gameState[room.id].propertyDecks,
		currencyDecks: gameState[room.id].currencyDecks,
	};
	gameState[room.id] = updatedGameState;
	// emit new changes (filtered) to all members
	emitNewGameState(io, room);

	// phase2's new round about to start
	// give each player the currency card they got
	// and get open next set of currencies if there are more
	// make any necessary changes (fetch hidden infos from server-side gameState)
	// if (
	// 	newGameState.phase === 2 &&
	// 	players.filter((player) => !player.selectedProperty).length === 0
	// ) {
	// 	console.log("LAST USER SELECTED PROPERTY");
	// 	setTimeout(() => {
	// 		const orderedPlayers = [...gameState[room.id].players].sort(
	// 			(a, b) => b.selectedProperty.value - a.selectedProperty.value
	// 		);
	// 		orderedPlayers.forEach((player) => {
	// 			const currencies = gameState[room.id].openCurrencies
	// 				.filter((currencyCard) => !currencyCard.taken)
	// 				.map((currencyCard) => currencyCard.value);
	// 			const maxCurrencyCard = gameState[room.id].openCurrencies.find(
	// 				(currencyCard) =>
	// 					currencyCard.value === Math.max(...currencies) &&
	// 					!currencyCard.taken
	// 			);
	// 			maxCurrencyCard.taken = player.username;
	// 		});

	// 		// each player gets currency card to their possession
	// 		gameState[room.id].players.forEach((player) => {
	// 			const acquiredCurrency = gameState[room.id].openCurrencies.find(
	// 				(currency) => currency.taken === player.username
	// 			);
	// 			player.currencies.push(acquiredCurrency);
	// 			player.isTurn = true;
	// 			player.properties = player.properties.filter(
	// 				(prop) => prop.value !== player.selectedProperty.value
	// 			);
	// 			player.selectedProperty = null;
	// 		});
	// 		if (gameState[room.id].remainingCurrencies >= players.length) {
	// 			gameState[room.id].openCurrencies = gameState[
	// 				room.id
	// 			].currencyDecks.splice(0, players.length);
	// 			gameState[room.id].remainingCurrencies =
	// 				gameState[room.id].currencyDecks.length;
	// 		} else {
	// 			// emit end game state (scores, rank, etc)
	// 			// TO DO
	// 			newGameState.openCurrencies = [];
	// 			newGameState.remainingCurrencies = 0;
	// 			gameState[room.id].phase = 3;
	// 			gameState[room.id].players.forEach((player) => {
	// 				let score = 0;
	// 				score += player.coins.reduce((sum, coin) => (sum += coin.value), 0);
	// 				score += player.currencies.reduce(
	// 					(sum, currency) => (sum += currency.value),
	// 					0
	// 				);
	// 				score /= 1000;
	// 				player.score = score;
	// 			});
	// 		}
	// 		emitNewGameState(io, room);
	// 	}, 3000);
	// }
};

const endForSale = (io) => ({ room }) => {
	gameState[room.id] = null;
	delete gameState[room.id];
	io.in(room.id).emit("updateGameState", null);
};

// HELPERS
const emitNewGameState = (io, room) => {
	// console.log("Current Server-side Game State:", gameState[room.id]);
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
		// if phase 2 and everyone chose property cards, return selectedProperties without filtering
		const filterSelectedProperty =
			gameState[roomId].phase === 1 ||
			gameState[roomId].players.filter((player) => !player.selectedProperty)
				.length !== 0;
		return {
			...player,
			coins: "hidden",
			properties: "hidden",
			currencies: "hidden",
			selectedProperty: filterSelectedProperty
				? "hidden"
				: player.selectedProperty,
		};
	});
	const filteredGameState = {
		...gameState[roomId],
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
