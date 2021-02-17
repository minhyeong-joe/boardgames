import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import Header from "./Header";
import Home from "./screen/Home";
import theme from "../style-customization/theme";

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Header />
				<Route path="/" exact component={Home} />
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
