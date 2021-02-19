import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import Header from "./Header";
import Home from "./screen/home/Home";
import theme from "../style-customization/theme";
import SingleGame from "./screen/single_game/SingleGame";
import LoginModal from "./modal/LoginModal";
import SignUpModal from "./modal/SignUpModal";
import FlashMessage from "./FlashMessage";
import Room from "./screen/single_room/Room";
import CreateRoomModal from "./modal/CreateRoomModal";

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Header />
				{/* MODALS */}
				<LoginModal />
				<SignUpModal />
				<CreateRoomModal />
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
