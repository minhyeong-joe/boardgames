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

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Header />
				{/* MODALS */}
				<LoginModal />
				<SignUpModal />
				{/* PAGES */}
				<Route path="/" exact component={Home} />
				<Route path="/game/:gameId" exact component={SingleGame} />
				<FlashMessage />
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
