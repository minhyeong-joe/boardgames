import React, { useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import theme from "../style-customization/theme";
// Pages
import Header from "./Header";
import Home from "./screen/home/Home";
import SingleGame from "./screen/single_game/SingleGame";
import Room from "./screen/single_room/Room";
// Modals & Flash
import LoginModal from "./modal/LoginModal";
import SignUpModal from "./modal/SignUpModal";
import CreateRoomModal from "./modal/CreateRoomModal";
import RoomPasswordModal from "./modal/RoomPasswordModal";
import FlashMessage from "./FlashMessage";
import { useDispatch } from "react-redux";
import { getUserInfo } from "../actions";

const App = () => {
	const dispatch = useDispatch();
	console.log(process.env);
	// on refresh, the redux store will get updated from session
	useEffect(() => {
		dispatch(getUserInfo());
	}, []);
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Header />
				{/* MODALS */}
				<LoginModal />
				<SignUpModal />
				<CreateRoomModal />
				<RoomPasswordModal />
				{/* PAGES */}
				<Route path="/" exact component={Home} />
				<Route path="/game/:gameId" exact component={SingleGame} />
				<Route path="/room/:roomId" exact component={Room} />
				<FlashMessage />
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
