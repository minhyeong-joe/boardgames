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
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// update type constants (manual sync with server-side constant needed)
const TYPES = {
	BID: "BID",
	PASS: "PASS",
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
	propertyRow: {
		width: "100%",
	},
	card: {
		position: "relative",
		borderRadius: "12px",
		width: "120px",
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
		backgroundColor: "rgba(0,0,0,0.5)",
		"& *": {
			color: "white",
		},
		"&.front": {
			backgroundColor: "lightblue",
			"& *": {
				color: "black",
			},
		},
	},
	activePlayerName: {
		color: theme.palette.error.dark,
		fontWeight: "bold",
	},
	biddingStatus: {
		border: "1px solid #aaa",
		padding: theme.spacing(1),
		backgroundColor: "#eee",
	},
	coinImage: {
		width: "60px",
		cursor: "pointer",
		borderRadius: "100%",
		"&.selected": {
			border: "2px solid orange",
			boxShadow: "0 0 10px orange",
		},
	},
	coinStatusTable: {
		borderTop: `1px solid #aaa`,
		borderBottom: `1px solid #aaa`,
		marginTop: theme.spacing(1),
		"&>.MuiGrid-item:first-child, &>.MuiGrid-item:nth-child(2)": {
			borderRight: `1px solid #aaa`,
		},
		"& p": {
			fontWeight: "bold",
		},
	},
	btnGroup: {
		marginTop: theme.spacing(2),
		textAlign: "center",
		"&>button": {
			fontWeight: "bold",
		},
		"&>button:first-child": {
			marginRight: theme.spacing(4),
		},
	},
	gameStateHeader: {
		fontWeight: "bold",
		fontSize: "0.8rem",
	},
	[theme.breakpoints.down("xs")]: {
		cardImage: {
			width: "70px",
		},
		coinStatusTable: {
			"&>.MuiGrid-item:first-child, &>.MuiGrid-item:nth-child(2)": {
				borderRight: "none",
				borderBottom: `1px solid #aaa`,
			},
		},
	},
}));

const PhaseOne = ({ socket, gameState, room }) => {
	const classes = useStyles();
	const auth = useSelector((state) => state.auth);
	const [activePlayer, setActivePlayer] = useState(null);
	const [myState, setMyState] = useState(null);
	const [selectedCoins, setSelectedCoins] = useState([]);
	const [selectedValues, setSelectedValues] = useState(0);

	useEffect(() => {
		const active = gameState?.players.find((player) => player.isTurn);
		const me = gameState?.players.find(
			(player) => player.userId === auth.userInfo._id
		);
		setActivePlayer(active);
		setMyState(me);
	}, [gameState]);

	const onCoinClick = (index, value) => {
		if (selectedCoins.includes(index)) {
			setSelectedCoins(selectedCoins.filter((idx) => idx !== index));
			setSelectedValues(selectedValues - value);
		} else {
			setSelectedCoins([...selectedCoins, index]);
			setSelectedValues(selectedValues + value);
		}
	};

	const onBidClick = () => {
		socket.emit("updateForSale", {
			type: TYPES.BID,
			payload: {
				selectedCoinsIndex: selectedCoins,
			},
			room,
			userId: myState.userId,
		});
		// unset selected coins from client-side view
		setSelectedCoins([]);
		setSelectedValues(0);
	};

	const onPassClick = () => {
		socket.emit("updateForSale", {
			type: TYPES.PASS,
			room,
			userId: myState.userId,
		});
		// unset selected coins from client-side view
		setSelectedCoins([]);
		setSelectedValues(0);
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

	// Utility to find minimum bid available for current round
	const minimumBid = () => {
		const bids = gameState.players.map((player) => player.bidding);
		return Math.max(...bids) + 1000;
	};

	return (
		<>
			{gameState && myState && (
				<div
					className={`${classes.root} ${myState.isTurn ? "" : classes.notTurn}`}
				>
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
											{gameState.remainingProperties}
										</Typography>
									</div>
								</Card>
							</Grid>
							<Grid container item xs spacing={1} justify="flex-start">
								{gameState.openProperties.map((propertyCard) => {
									const renderCard = () => (
										<Card className={classes.card}>
											<CardMedia
												src={propertyCard.image_url}
												component="img"
												className={classes.cardImage}
											/>
											<div className={`${classes.cardOverlay} front`}>
												<Typography variant="h5">
													{propertyCard.value}
												</Typography>
											</div>
										</Card>
									);
									const taken = propertyCard.taken;
									return (
										<Grid item key={propertyCard.value}>
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
							</Grid>
						</Grid>
						<Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
						<Typography variant="overline" className={classes.gameStateHeader}>
							Bidding Status
						</Typography>
						<Grid container className={classes.biddingRow} spacing={1}>
							{gameState.players.map((player) => {
								return (
									<Grid item xs={12} sm={6} key={player.userId}>
										<Typography
											variant="h6"
											className={`${
												activePlayer && player.userId === activePlayer.userId
													? classes.activePlayerName
													: ""
											} ${classes.biddingStatus}`}
										>
											{player.username}:{" "}
											{player.bidding || player.bidding === 0
												? `$ ${numberWithCommas(player.bidding)}`
												: "PASS"}
										</Typography>
									</Grid>
								);
							})}
						</Grid>
						<Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
						<Grid container spacing={1} justify="flex-start">
							{myState.coins.map((coin, index) => {
								return (
									<Grid item key={index}>
										<img
											title={coin.value}
											src={coin.image_url}
											alt="coin"
											className={`${classes.coinImage} ${
												selectedCoins.includes(index) && "selected"
											}`}
											onClick={() => onCoinClick(index, coin.value)}
										/>
									</Grid>
								);
							})}
						</Grid>
						<Grid
							container
							spacing={2}
							justify="center"
							className={classes.coinStatusTable}
						>
							<Grid item xs={12} sm={4}>
								<Typography>Remaining: $ {remainingCoins()}</Typography>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Typography>
									Current: ${" "}
									{numberWithCommas(selectedValues + myState.bidding)}
								</Typography>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Typography>
									Minimum: $ {numberWithCommas(minimumBid())}
								</Typography>
							</Grid>
						</Grid>
						<div className={classes.btnGroup}>
							<Button
								variant="contained"
								color="primary"
								onClick={onBidClick}
								disabled={
									selectedValues + myState.bidding < minimumBid() ||
									!myState.isTurn
								}
							>
								Bid
							</Button>
							<Button
								variant="contained"
								color="secondary"
								onClick={onPassClick}
								disabled={!myState.isTurn}
							>
								Pass
							</Button>
						</div>
						{myState && myState.properties.length > 0 && (
							<>
								<Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
								<Typography
									variant="overline"
									className={classes.gameStateHeader}
								>
									My Properties
								</Typography>
								<Grid container item xs spacing={1} justify="flex-start">
									{myState.properties.map((propertyCard) => (
										<Grid item key={propertyCard.value}>
											<Card className={`${classes.card}`}>
												<CardMedia
													src={propertyCard.image_url}
													component="img"
													className={classes.cardImage}
												/>
												<div className={`${classes.cardOverlay} front`}>
													<Typography variant="h5">
														{propertyCard.value}
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

export default PhaseOne;
