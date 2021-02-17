import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
	typography: {
		h1: {
			fontFamily: "'Truculenta', 'sans-serif'",
		},
		h2: {
			fontFamily: "'Truculenta', 'sans-serif'",
		},
		h3: {
			fontFamily: "'Truculenta', 'sans-serif'",
		},
		h4: {
			fontFamily: "'Truculenta', 'sans-serif'",
		},
		h5: {
			fontFamily: "'Truculenta', 'sans-serif'",
		},
		h6: {
			fontFamily: "'Truculenta', 'sans-serif'",
		},
		subtitle1: {
			fontFamily: "'Truculenta', 'sans-serif'",
		},
		subtitle2: {
			fontFamily: "'Roboto', 'sans-serif'",
		},
		body1: {
			fontFamily: "'Ubuntu', 'sans-serif'",
		},
		body2: {
			fontFamily: "'Roboto', 'sans-serif'",
		},
		button: {
			fontFamily: "'Ubuntu', 'sans-serif'",
		},
	},
	palette: {
		primary: {
			main: "#6200EE",
			mainGradient: "linear-gradient(135deg, #82A3E8, #902DCB)",
		},
		secondary: {
			main: "#03dac5",
		},
		success: {
			main: "#90c418",
		},
		info: {
			main: "#59adff",
		},
	},
});

export default theme;
