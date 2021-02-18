import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import Header from "./Header";
import Home from "./screen/home/Home";
import theme from "../style-customization/theme";
import SingleGame from "./screen/single_game/SingleGame";

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Header />
				<Route path="/" exact component={Home} />
				<Route path="/game/:gameId" exact component={SingleGame} />
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
