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
import tempImage from "../../assets/image/boardgame_temp.png";

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
	},
	cardImage: {
		height: "auto",
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
		backgroundColor: "rgba(0,0,0,0.4)",
		"& *": {
			color: "white",
		},
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
	btnGroup: {
		marginTop: theme.spacing(2),
		textAlign: "center",
		"&>button:first-child": {
			marginRight: theme.spacing(4),
		},
	},
	[theme.breakpoints.down("xs")]: {
		cardImage: {
			width: "70px",
		},
	},
}));

const PhaseOne = ({ socket, gameState, gameName, room }) => {
	const classes = useStyles();
	const auth = useSelector((state) => state.auth);
	const [selectedCoins, setSelectedCoins] = useState([]);
	const [activePlayer, setActivePlayer] = useState(null);
	const [myState, setMyState] = useState(null);
	const [selectedValues, setSelectedValues] = useState(0);

	useEffect(() => {
		const active = gameState?.players.find((player) => player.isTurn);
		const me = gameState?.players.find(
			(player) => player.userId === auth.userInfo._id
		);
		setActivePlayer(active);
		setMyState(me);
	}, [gameState]);

	const onPassTurn = () => {
		if (myState.isTurn) {
			const currentPlayerIndex = gameState.players.findIndex(
				(player) => player.userId === auth.userInfo._id
			);
			const nextPlayerIndex =
				currentPlayerIndex + 1 >= gameState.players.length
					? 0
					: currentPlayerIndex + 1;
			const players = gameState.players.map((player, index) => {
				if (index === nextPlayerIndex) {
					return {
						...player,
						isTurn: true,
					};
				}
				return {
					...player,
					isTurn: false,
				};
			});
			const newGameState = {
				...gameState,
				players,
			};
			socket.emit("updateGameState", {
				gameName,
				room,
				newGameState,
				userId: auth.userInfo._id,
			});
		}
	};

	const onEndGame = () => {
		if (myState.isTurn) {
			socket.emit("endGame", { gameName, room }, () => {
				socket.emit("moveTurn", { roomId: room.id });
			});
		}
	};

	const onCoinClick = (index, value) => {
		if (selectedCoins.includes(index)) {
			setSelectedCoins(selectedCoins.filter((idx) => idx !== index));
			setSelectedValues(selectedValues - value);
		} else {
			setSelectedCoins([...selectedCoins, index]);
			setSelectedValues(selectedValues + value);
		}
	};

	const numberWithCommas = (num) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	const remainingCoins = () => {
		return numberWithCommas(
			myState.coins.reduce((acc, coin) => acc + coin.value, 0)
		);
	};

	return (
		<>
			{gameState && myState && activePlayer && (
				<div
					className={`${classes.root} ${myState.isTurn ? "" : classes.notTurn}`}
				>
					<Alert severity="info" variant="filled">
						<AlertTitle>Player username1 is making a decision...</AlertTitle>
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
										<Typography variant="h5">26</Typography>
									</div>
								</Card>
							</Grid>
							<Grid container item xs spacing={1} justify="flex-start">
								<Grid item>
									<Badge
										badgeContent="username5"
										color="primary"
										anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
									>
										<Card className={`${classes.card}`}>
											<CardMedia
												src="https://cdn2.bigcommerce.com/n-d57o0b/1kujmu/products/297/images/926/4H__83243.1440113515.1280.1280.png?c=2"
												component="img"
												className={classes.cardImage}
											/>
										</Card>
									</Badge>
								</Grid>
								<Grid item>
									<Card className={`${classes.card}`}>
										<CardMedia
											src="https://cdn2.bigcommerce.com/n-d57o0b/1kujmu/products/297/images/926/4H__83243.1440113515.1280.1280.png?c=2"
											component="img"
											className={classes.cardImage}
										/>
									</Card>
								</Grid>
								<Grid item>
									<Card className={`${classes.card}`}>
										<CardMedia
											src="https://cdn2.bigcommerce.com/n-d57o0b/1kujmu/products/297/images/926/4H__83243.1440113515.1280.1280.png?c=2"
											component="img"
											className={classes.cardImage}
										/>
									</Card>
								</Grid>
								<Grid item>
									<Badge
										badgeContent="username6"
										color="primary"
										anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
									>
										<Card className={`${classes.card}`}>
											<CardMedia
												src="https://cdn2.bigcommerce.com/n-d57o0b/1kujmu/products/297/images/926/4H__83243.1440113515.1280.1280.png?c=2"
												component="img"
												className={classes.cardImage}
											/>
										</Card>
									</Badge>
								</Grid>
								<Grid item>
									<Card className={`${classes.card}`}>
										<CardMedia
											src="https://cdn2.bigcommerce.com/n-d57o0b/1kujmu/products/297/images/926/4H__83243.1440113515.1280.1280.png?c=2"
											component="img"
											className={classes.cardImage}
										/>
									</Card>
								</Grid>
								<Grid item>
									<Card className={`${classes.card}`}>
										<CardMedia
											src="https://cdn2.bigcommerce.com/n-d57o0b/1kujmu/products/297/images/926/4H__83243.1440113515.1280.1280.png?c=2"
											component="img"
											className={classes.cardImage}
										/>
									</Card>
								</Grid>
							</Grid>
						</Grid>
						<Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
						<Typography variant="overline">Bidding Status</Typography>
						<Grid container className={classes.biddingRow} spacing={1}>
							<Grid item xs={6}>
								<Typography variant="h6">username1: 2</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography variant="h6">username2: 3</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography variant="h6">username3: 4</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography variant="h6">username4: 5</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography variant="h6">username5: PASS</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography variant="h6">username6: PASS</Typography>
							</Grid>
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
						<Grid container spacing={2} justify="center">
							<Grid item xs={12} sm={4}>
								<Typography>Remaining: {remainingCoins()}</Typography>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Typography>
									Current: {numberWithCommas(selectedValues)}
								</Typography>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Typography>Minimum: 7,000</Typography>
							</Grid>
						</Grid>
						<div className={classes.btnGroup}>
							<Button variant="contained" color="primary">
								Bid
							</Button>
							<Button variant="contained" color="secondary">
								Pass
							</Button>
						</div>
						<Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
						<Typography variant="overline">My Properties</Typography>
						<Grid container item xs spacing={1} justify="flex-start">
							<Grid item>
								<Card className={`${classes.card}`}>
									<CardMedia
										src="https://cdn2.bigcommerce.com/n-d57o0b/1kujmu/products/297/images/926/4H__83243.1440113515.1280.1280.png?c=2"
										component="img"
										className={classes.cardImage}
									/>
								</Card>
							</Grid>
							<Grid item>
								<Card className={`${classes.card}`}>
									<CardMedia
										src="https://cdn2.bigcommerce.com/n-d57o0b/1kujmu/products/297/images/926/4H__83243.1440113515.1280.1280.png?c=2"
										component="img"
										className={classes.cardImage}
									/>
								</Card>
							</Grid>
							<Grid item>
								<Card className={`${classes.card}`}>
									<CardMedia
										src="https://cdn2.bigcommerce.com/n-d57o0b/1kujmu/products/297/images/926/4H__83243.1440113515.1280.1280.png?c=2"
										component="img"
										className={classes.cardImage}
									/>
								</Card>
							</Grid>
						</Grid>
					</div>
				</div>
			)}
		</>
	);
};

export default PhaseOne;
