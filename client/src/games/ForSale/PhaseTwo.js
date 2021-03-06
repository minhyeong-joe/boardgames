import {
	Badge,
	Button,
	Card,
	CardMedia,
	Divider,
	Grid,
	makeStyles,
	Typography,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import startSound from "../../assets/sound/starlight.wav";
import beepSound from "../../assets/sound/short_beep.wav";
import propertySound from "../../assets/sound/warm_beep.wav";
import cardSound from "../../assets/sound/card_flip.wav";
import turnSound from "../../assets/sound/turn.ogg";

// update type constants (manual sync with server-side constant needed)
const TYPES = {
	CONFIRM_PROPERTY: "CONFIRM_PROPERTY",
};

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	boardWrapper: {
		padding: theme.spacing(1),
	},
	// notTurn: {
	// 	pointerEvents: "none",
	// },
	activePlayerName: {
		color: theme.palette.error.dark,
		fontWeight: "bold",
	},
	propertyRow: {
		width: "100%",
	},
	card: {
		position: "relative",
		borderRadius: "12px",
		width: "120px",
		"&.selected": {
			border: "2px solid orange",
			boxShadow: "0 0 10px orange",
		},
	},
	cardOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.4)",
		"& *": {
			color: "white",
		},
		"&.front": {
			backgroundColor: "lightblue",
			"& *": {
				color: "black",
			},
		},
		"&.toBeSelected": {
			border: "2px dashed black",
			boxShadow: "none",
			backgroundColor: "white",
			"& *": {
				color: "black",
			},
		},
	},
	username: {
		fontSize: "1.2rem",
		fontWeight: "bold",
	},
	selectableProperty: {
		cursor: "pointer",
		border: "2px solid lightblue",
	},
	confirmBtn: {
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: theme.spacing(2),
		display: "block",
		backgroundColor: theme.palette.info.main,
		color: theme.palette.success.contrastText,
		letterSpacing: "2px",
		fontWeight: "bold",
		"&:hover": {
			backgroundColor: theme.palette.info.light,
		},
	},
	coinImage: {
		width: "60px",
		borderRadius: "100%",
	},
	cardImage: {
		width: "100%",
	},
	gameStateHeader: {
		fontWeight: "bold",
		fontSize: "0.8rem",
	},
	flipContainer: {
		width: "120px",
		height: "160.16px",
		position: "relative",
		borderRadius: "12px",
	},
	flipCard: {
		position: "absolute",
		height: "100%",
		width: "100%",
		transformStyle: "preserve-3d",
		transition: "all 0.5s ease",
		borderRadius: "12px",
		"&.reveal": {
			transform: "rotateY(180deg)",
		},
	},
	back: {
		position: "absolute",
		height: "100%",
		width: "100%",
		backfaceVisibility: "hidden",
		borderRadius: "12px",
	},
	front: {
		position: "absolute",
		height: "100%",
		width: "100%",
		backfaceVisibility: "hidden",
		transform: "rotateY(180deg)",
		borderRadius: "12px",
	},
	[theme.breakpoints.down("xs")]: {
		card: {
			width: "70px",
		},
		flipContainer: {
			width: "70px",
			height: "93.42px",
		},
	},
}));

const PhaseTwo = ({ socket, gameState, room }) => {
	const classes = useStyles();
	const auth = useSelector((state) => state.auth);
	const [myState, setMyState] = useState(null);
	const [activePlayer, setActivePlayer] = useState(null);
	const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(null);
	const [showCards, setShowCards] = useState(false);
	const [startAudio] = useState(new Audio(startSound));
	const [propertyAudio] = useState(new Audio(propertySound));
	const [beepAudio] = useState(new Audio(beepSound));
	const [cardAudio] = useState(new Audio(cardSound));
	const [turnAudio] = useState(new Audio(turnSound));

	useEffect(() => {
		if (gameState && gameState.players.every((player) => player.selected)) {
			beepAudio.currentTime = 0;
			beepAudio.play();
		} else if (
			gameState &&
			myState &&
			gameState.players.find((player) => player.userId === myState.userId)
				.isTurn
		) {
			turnAudio.currentTime = 0;
			turnAudio.play();
		} else if (
			gameState &&
			activePlayer &&
			gameState.players.find((player) => player.userId === activePlayer.userId)
				.selected
		) {
			propertyAudio.currentTime = 0;
			propertyAudio.play();
		}

		const me = gameState?.players.find(
			(player) => player.userId === auth.userInfo._id
		);
		const active = gameState?.players.find((player) => player.isTurn);
		setActivePlayer(active);
		setMyState(me);
		if (!me.selectedProperty) {
			setSelectedPropertyIndex(null);
		}
		// show cards if everyone selected
		if (gameState?.players.every((player) => player.selected)) {
			setTimeout(() => {
				// add card flipping sound here in the future
				cardAudio.currentTime = 0;
				cardAudio.play();
				setShowCards(true);
			}, 1500);
		} else {
			setShowCards(false);
		}
	}, [gameState]);

	// debugging purpose
	useEffect(() => {
		console.log("PHASE 2", gameState);
	}, [gameState]);

	useEffect(() => {
		startAudio.play();
	}, []);

	const onPropertySelect = (index) => {
		if (!myState.isTurn) return;
		if (index === selectedPropertyIndex) {
			setSelectedPropertyIndex(null);
		} else {
			setSelectedPropertyIndex(index);
		}
	};

	const onConfirmSelection = () => {
		socket.emit("updateForSale", {
			type: TYPES.CONFIRM_PROPERTY,
			payload: {
				selectedPropertyIndex,
			},
			room,
			userId: myState.userId,
		});
		setSelectedPropertyIndex(null);
	};

	// Utility to display coin values with commas in every three digits
	const numberWithCommas = (num) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	// Utility to render client user's remaining coin values
	const remainingCoins = () => {
		return numberWithCommas(
			myState.coins.reduce((acc, coin) => acc + coin.value, 0)
		);
	};

	return (
		<>
			{gameState && myState && (
				<div className={classes.root}>
					<Alert severity="info" variant="standard">
						{activePlayer ? (
							<AlertTitle>
								Player{" "}
								<span className={classes.activePlayerName}>
									{activePlayer.username}
								</span>{" "}
								is making a decision...
							</AlertTitle>
						) : (
							<AlertTitle> New round is about to begin...</AlertTitle>
						)}
					</Alert>
					<div className={classes.boardWrapper}>
						<Grid
							container
							className={classes.propertyRow}
							justify="center"
							alignItems="flex-start"
							spacing={2}
						>
							<Grid item>
								<Card className={classes.card}>
									<CardMedia
										src="https://i.pinimg.com/236x/b9/70/33/b97033a8708d2cbaf7d1990020a89a54--playing-cards-deck.jpg"
										component="img"
										className={classes.cardImage}
									/>
									<div className={classes.cardOverlay}>
										<Typography variant="h5">
											{gameState.remainingCurrencies}
										</Typography>
									</div>
								</Card>
							</Grid>
							<Grid container item xs spacing={1} justify="flex-start">
								{gameState.openCurrencies.map((currencyCard, index) => {
									const renderCard = () => (
										<Card className={`${classes.card}`}>
											<CardMedia
												src={currencyCard.image_url}
												component="img"
												className={classes.cardImage}
											/>
											<div className={`${classes.cardOverlay} front`}>
												<Typography variant="h6">
													{`$ ${numberWithCommas(currencyCard.value)}`}
												</Typography>
											</div>
										</Card>
									);
									const taken = currencyCard.taken;
									return (
										<Grid item key={index}>
											{taken && showCards ? (
												<Badge
													badgeContent={taken}
													color="primary"
													anchorOrigin={{
														vertical: "bottom",
														horizontal: "left",
													}}
												>
													{renderCard()}
												</Badge>
											) : (
												renderCard()
											)}
										</Grid>
									);
								})}
							</Grid>
						</Grid>
						<Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
						{myState.selected && (
							<>
								<Grid container spacing={2} justify="flex-start">
									{gameState.players.map((player) => (
										<Fragment key={player.userId}>
											{/* My own card is always visible */}
											{player.userId === myState.userId && (
												<Grid item>
													<Card className={classes.card}>
														<CardMedia
															src={player.selectedProperty.image_url}
															component="img"
															className={classes.cardImage}
														/>
														<div className={`${classes.cardOverlay} front`}>
															<Typography variant="h5">
																{player.selectedProperty.value}
															</Typography>
														</div>
													</Card>
													<Typography
														variant="subtitle1"
														align="center"
														className={classes.username}
													>
														{player.username}
													</Typography>
												</Grid>
											)}
											{/* Player selected but is hidden yet */}
											{player.selected && player.selectedProperty === "hidden" && (
												<Grid item>
													<Card className={classes.card}>
														<CardMedia
															src="https://i.pinimg.com/236x/b9/70/33/b97033a8708d2cbaf7d1990020a89a54--playing-cards-deck.jpg"
															component="img"
															className={classes.cardImage}
														/>
														<div className={`${classes.cardOverlay}`}>
															<Typography variant="h4">?</Typography>
														</div>
													</Card>
													<Typography
														variant="subtitle1"
														align="center"
														className={classes.username}
													>
														{player.username}
													</Typography>
												</Grid>
											)}
											{/* Player has not selected yet */}
											{!player.selected && (
												<Grid item>
													<Card className={`${classes.card}`}>
														<CardMedia
															src="https://i.pinimg.com/236x/b9/70/33/b97033a8708d2cbaf7d1990020a89a54--playing-cards-deck.jpg"
															component="img"
															className={classes.cardImage}
														/>
														<div
															className={`${classes.cardOverlay} toBeSelected`}
														></div>
													</Card>
													<Typography
														variant="subtitle1"
														align="center"
														className={classes.username}
													>
														{player.username}
													</Typography>
												</Grid>
											)}
											{/* Other players' cards are now revealed */}
											{player.userId !== myState.userId &&
												player.selectedProperty !== "hidden" && (
													<Grid item>
														<div className={`${classes.flipContainer}`}>
															<div
																className={`${classes.flipCard} ${
																	showCards ? "reveal" : ""
																}`}
															>
																<Card className={classes.back}>
																	<CardMedia
																		src="https://i.pinimg.com/236x/b9/70/33/b97033a8708d2cbaf7d1990020a89a54--playing-cards-deck.jpg"
																		component="img"
																		className={classes.cardImage}
																	/>
																	<div className={`${classes.cardOverlay}`}>
																		<Typography variant="h4">?</Typography>
																	</div>
																</Card>
																<Card className={classes.front}>
																	<CardMedia
																		src={player.selectedProperty.image_url}
																		component="img"
																		className={classes.cardImage}
																	/>
																	<div
																		className={`${classes.cardOverlay} front`}
																	>
																		<Typography variant="h5">
																			{player.selectedProperty.value}
																		</Typography>
																	</div>
																</Card>
															</div>
														</div>
														<Typography
															variant="subtitle1"
															align="center"
															className={classes.username}
														>
															{player.username}
														</Typography>
													</Grid>
												)}
										</Fragment>
									))}
								</Grid>
								<Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
							</>
						)}
						{activePlayer?.userId === myState?.userId && (
							<Typography
								variant="h5"
								align="center"
								color="error"
								style={{
									fontWeight: "bold",
									backgroundColor: "lightsalmon",
									borderRadius: "12px",
								}}
							>
								Your Turn
							</Typography>
						)}
						<Typography variant="h5" align="center">
							{myState.selectedProperty || !myState.isTurn
								? "My Properties"
								: "Select a Property to Sell"}
						</Typography>
						<Grid container item xs spacing={1} justify="flex-start">
							{myState.properties.map((propertyCard, index) => (
								<Grid item key={propertyCard.value}>
									<Card
										className={`${classes.card} ${
											myState.isTurn ? classes.selectableProperty : ""
										} ${selectedPropertyIndex === index ? "selected" : ""}`}
										onClick={() => onPropertySelect(index)}
									>
										<CardMedia
											src={propertyCard.image_url}
											component="img"
											className={classes.cardImage}
										/>
										<div className={`${classes.cardOverlay} front`}>
											<Typography variant="h5">{propertyCard.value}</Typography>
										</div>
									</Card>
								</Grid>
							))}
						</Grid>
						{!myState.selected && myState.isTurn && (
							<Button
								variant="contained"
								color="primary"
								className={classes.confirmBtn}
								onClick={onConfirmSelection}
								disabled={
									selectedPropertyIndex === null ||
									activePlayer.userId !== myState.userId
								}
							>
								Confirm
							</Button>
						)}
						<Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
						<Typography
							variant="overline"
							className={classes.gameStateHeader}
							style={{ marginBottom: "12px" }}
						>
							My Coins: $ {remainingCoins()}
						</Typography>
						<Grid container spacing={1} justify="flex-start">
							{myState.coins.map((coin, index) => {
								return (
									<Grid item key={index}>
										<img
											title={coin.value}
											src={coin.image_url}
											alt="coin"
											className={classes.coinImage}
										/>
									</Grid>
								);
							})}
						</Grid>
						{myState.currencies.length > 0 && (
							<>
								<Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
								<Typography variant="h5">My Currencies</Typography>
								<Grid container item xs spacing={1} justify="flex-start">
									{myState.currencies.map((currencyCard, index) => (
										<Grid item key={index}>
											<Card className={classes.card}>
												<CardMedia
													src={currencyCard.image_url}
													component="img"
													className={classes.cardImage}
												/>
												<div className={`${classes.cardOverlay} front`}>
													<Typography variant="h6">
														{`$ ${numberWithCommas(currencyCard.value)}`}
													</Typography>
												</div>
											</Card>
										</Grid>
									))}
								</Grid>
							</>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default PhaseTwo;
