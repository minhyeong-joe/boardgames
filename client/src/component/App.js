import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";

import Header from "./Header";
import theme from "../style-customization/theme";

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Header />
		</ThemeProvider>
	);
};

export default App;
