import {
	Button,
	Card,
	CardMedia,
	Divider,
	Grid,
	makeStyles,
	Typography,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	activePlayerName: {
		color: theme.palette.error.dark,
		fontWeight: "bold",
	},
	boardWrapper: {
		padding: theme.spacing(1),
	},
	propertyRow: {
		width: "100%",
	},
	card: {
		position: "relative",
		borderRadius: "12px",
		width: "120px",
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
		"&.selected": {
			border: "2px solid orange",
			boxShadow: "0 0 10px orange",
		},
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
	const [playersSelecting, setPlayersSelecting] = useState([]);
	const [selectedProperty, setSelectedProperty] = useState(null);
	const [showCard, setShowCard] = useState(false);

	useEffect(() => {
		const me = gameState?.players.find(
			(player) => player.userId === auth.userInfo._id
		);
		const selecting = gameState?.players.filter(
			(player) => !player.selectedProperty
		);
		setMyState(me);
		setPlayersSelecting(selecting);
	}, [gameState]);

	// debugging purpose
	useEffect(() => {
		console.log("PHASE 2", gameState);
	}, [gameState]);

	const onPropertySelect = (index) => {
		if (index === selectedProperty) {
			setSelectedProperty(null);
		} else {
			setSelectedProperty(index);
		}
	};

	const onConfirmSelection = () => {
		const newPlayerState = gameState.players.map((player) => {
			if (player.userId === myState.userId) {
				return {
					...myState,
					selectedProperty,
				};
			}
			return player;
		});
		const newGameState = {
			...gameState,
			players: newPlayerState,
		};
		console.log(newGameState);
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
					<Alert severity="info" variant="filled">
						{playersSelecting.length > 0 ? (
							<AlertTitle>
								Waiting for{" "}
								{playersSelecting.map((player, index) => (
									<>
										<span className={classes.activePlayerName}>
											{player.username}
										</span>
										<span>
											{index === playersSelecting.length - 1 ? "..." : ", "}
										</span>
									</>
								))}
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
								<Card className={`${classes.backOfCard} ${classes.card}`}>
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
								{gameState.openCurrencies.map((currencyCard) => (
									<Grid item key={currencyCard.value}>
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
									</Grid>
								))}
							</Grid>
						</Grid>
						<Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
						{(true || myState.selectedProperty) && (
							<>
								<Grid container spacing={2} justify="flex-start">
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
									>
										<Grid item xs={6}>
											<Typography variant="body1">username123:</Typography>
										</Grid>
										<Grid item xs={6}>
											<Card className={`${classes.card}`}>
												<CardMedia
													src="https://i.pinimg.com/236x/b9/70/33/b97033a8708d2cbaf7d1990020a89a54--playing-cards-deck.jpg"
													component="img"
													className={classes.cardImage}
												/>
												<div className={classes.cardOverlay}></div>
											</Card>
										</Grid>
									</Grid>
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
									>
										<Grid item xs={6}>
											<Typography variant="body1">username123:</Typography>
										</Grid>
										<Grid item xs={6}>
											<Card className={`${classes.card}`}>
												<CardMedia
													src="https://i.pinimg.com/236x/b9/70/33/b97033a8708d2cbaf7d1990020a89a54--playing-cards-deck.jpg"
													component="img"
													className={classes.cardImage}
												/>
												<div className={classes.cardOverlay}></div>
											</Card>
										</Grid>
									</Grid>
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
									>
										<Grid item xs={6}>
											<Typography variant="body1">username123:</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant="subtitle1">Selecting...</Typography>
										</Grid>
									</Grid>
								</Grid>
								<Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
							</>
						)}
						<Typography variant="h5" align="center">
							{myState.selectedProperty
								? "My Properties"
								: "Select a Property to Sell"}
						</Typography>
						<Grid container item xs spacing={1} justify="flex-start">
							{myState.properties.map((propertyCard, index) => (
								<Grid item key={propertyCard.value}>
									<Card
										className={`${classes.card} ${classes.selectableProperty} ${
											selectedProperty === index ? "selected" : ""
										}`}
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
						{!myState.selectedProperty && (
							<Button
								variant="contained"
								color="primary"
								className={classes.confirmBtn}
								onClick={onConfirmSelection}
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
					</div>
				</div>
			)}
		</>
	);
};

export default PhaseTwo;
