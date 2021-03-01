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
	notTurn: {
		pointerEvents: "none",
	},
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
	cardImage: {
		height: "auto",
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
	},
	selectableProperty: {
		cursor: "pointer",
		border: "2px solid transparent",
		boxShadow: "none",
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
	[theme.breakpoints.down("xs")]: {
		card: {
			width: "70px",
		},
	},
}));

const PhaseTwo = ({ socket, gameState, room }) => {
	const classes = useStyles();
	const auth = useSelector((state) => state.auth);
	const [myState, setMyState] = useState(null);
	const [activePlayer, setActivePlayer] = useState(null);
	const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(null);

	useEffect(() => {
		const me = gameState?.players.find(
			(player) => player.userId === auth.userInfo._id
		);
		const active = gameState?.players.find((player) => player.isTurn);
		setActivePlayer(active);
		setMyState(me);
		if (!me.selectedProperty) {
			setSelectedPropertyIndex(null);
		}
	}, [gameState]);

	// debugging purpose
	useEffect(() => {
		console.log("PHASE 2", gameState);
	}, [gameState]);

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
				<div
					className={`${classes.root} ${myState.isTurn ? "" : classes.notTurn}`}
				>
					<Alert severity="info" variant="filled">
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
								{gameState.openCurrencies.map((currencyCard) => {
									const renderCard = () => (
										<Card className={`${classes.card}`}>
											<CardMedia
												src={currencyCard.image_url}
												component="img"
												className={classes.cardImage}
											/>
											<div className={classes.cardOverlay}>
												<Typography variant="h6">
													{`$ ${numberWithCommas(currencyCard.value)}`}
												</Typography>
											</div>
										</Card>
									);
									const taken = currencyCard.taken;
									return (
										<Grid item key={currencyCard.value}>
											{taken ? (
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
								{/* {gameState.openCurrencies.map((currencyCard, index) => (
									<Grid item key={index}>
										<Card className={classes.card}>
											<CardMedia
												src={currencyCard.image_url}
												component="img"
												className={classes.cardImage}
											/>
											<div className={classes.cardOverlay}>
												<Typography variant="h6">
													{`$ ${numberWithCommas(currencyCard.value)}`}
												</Typography>
											</div>
										</Card>
									</Grid>
								))} */}
							</Grid>
						</Grid>
						<Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
						{myState.selected && (
							<>
								<Grid container spacing={2} justify="flex-start">
									{gameState.players.map((player) => {
										return (
											<Grid
												item
												container
												spacing={1}
												xs={12}
												sm={6}
												alignItems="center"
												justify="center"
												zeroMinWidth
												wrap="wrap"
												style={{ lineBreak: "anywhere" }}
												key={player.userId}
											>
												<Grid item xs={6}>
													<Typography variant="body1">
														{player.username}:
													</Typography>
												</Grid>
												<Grid item xs={6}>
													{player.selectedProperty === "hidden" && (
														<Card className={`${classes.card}`}>
															<CardMedia
																src="https://i.pinimg.com/236x/b9/70/33/b97033a8708d2cbaf7d1990020a89a54--playing-cards-deck.jpg"
																component="img"
																className={classes.cardImage}
															/>
															<div className={classes.cardOverlay}>
																{player.isTurn && (
																	<Typography variant="body1">
																		SELECTING...
																	</Typography>
																)}
																{player.selected && (
																	<Typography variant="body1">
																		SELECTED
																	</Typography>
																)}
																{!player.isTurn && !player.selected && (
																	<Typography variant="body1">
																		WAITING...
																	</Typography>
																)}
															</div>
														</Card>
													)}
													{player.selectedProperty &&
														player.selectedProperty !== "hidden" && (
															<Card className={`${classes.card}`}>
																<CardMedia
																	src={player.selectedProperty.image_url}
																	component="img"
																	className={classes.cardImage}
																/>
																<div className={classes.cardOverlay}>
																	<Typography variant="h5">
																		{player.selectedProperty.value}
																	</Typography>
																</div>
															</Card>
														)}
												</Grid>
											</Grid>
										);
									})}
								</Grid>
								<Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
							</>
						)}
						{activePlayer?.userId === myState?.userId && (
							<Typography variant="h4" align="center" color="error">
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
										<div className={classes.cardOverlay}>
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
						<Typography>My Coins: $ {remainingCoins()}</Typography>
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
												<div className={classes.cardOverlay}>
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
						<Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
					</div>
				</div>
			)}
		</>
	);
};

export default PhaseTwo;
