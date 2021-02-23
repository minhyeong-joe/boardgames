import React, { useState } from "react";
import {
	AppBar,
	Box,
	Grid,
	IconButton,
	makeStyles,
	Tab,
	Tabs,
	TextField,
	Typography,
} from "@material-ui/core";
import { AiOutlineSend } from "react-icons/ai";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: "240px",
		boxShadow: `0 0 5px ${theme.palette.grey[500]}`,
	},
	messages: {
		height: "300px",
		overflow: "auto",
		overflowWrap: "everywhere",
		"&::-webkit-scrollbar": {
			width: "10px",
		},
		"&::-webkit-scrollbar-track": {
			boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
			// -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
		},
		"&::-webkit-scrollbar-thumb": {
			backgroundColor: theme.palette.grey[700],
			outline: "1px solid slategray",
		},
	},
	logs: {
		height: "352px",
		overflow: "auto",
		overflowWrap: "everywhere",
		"&::-webkit-scrollbar": {
			width: "10px",
		},
		"&::-webkit-scrollbar-track": {
			boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
			// -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
		},
		"&::-webkit-scrollbar-thumb": {
			backgroundColor: theme.palette.grey[700],
			outline: "1px solid slategray",
		},
	},
	myMessage: {
		backgroundColor: theme.palette.info.light,
		color: theme.palette.info.contrastText,
		marginLeft: "12%",
		borderRadius: "12px",
		marginBottom: theme.spacing(1),
	},
	userMessage: {
		backgroundColor: theme.palette.grey[500],
		marginRight: "12%",
		borderRadius: "12px",
		marginBottom: theme.spacing(1),
	},
	[theme.breakpoints.down("xs")]: {
		root: {
			width: "100%",
		},
	},
}));

const TabPanel = (props) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={2}>{children}</Box>}
		</div>
	);
};

const ChatLog = () => {
	const classes = useStyles();
	const [tab, setTab] = useState(0);

	const handleTabChange = (e, newVal) => {
		setTab(newVal);
	};

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
					<Tab label="Chat" id="simple-tab-0" style={{ minWidth: "50%" }} />
					<Tab label="Log" id="simple-tab-1" style={{ minWidth: "50%" }} />
				</Tabs>
			</AppBar>
			<TabPanel value={tab} index={0}>
				<div className={classes.messages}>
					<Box p={1} className={classes.myMessage}>
						<Typography variant="body2">
							Hello, my name is Billy Joe. Welcome!!!!!!!!!!!!!!!
						</Typography>
					</Box>
					<Box p={1} className={classes.userMessage}>
						<Typography variant="subtitle1">user123:</Typography>
						<Typography variant="body2">Hello, Good to see you!</Typography>
					</Box>
					<Box p={1} className={classes.userMessage}>
						<Typography variant="subtitle1">user123:</Typography>
						<Typography variant="body2">Hello, Good to see you!</Typography>
					</Box>
					<Box p={1} className={classes.userMessage}>
						<Typography variant="subtitle1">user123:</Typography>
						<Typography variant="body2">Hello, Good to see you!</Typography>
					</Box>
					<Box p={1} className={classes.myMessage}>
						<Typography variant="body2">
							Hello, my name is Billy Joe. Welcome!!!!!!!!!!!!!!!
						</Typography>
					</Box>
					<Box p={1} className={classes.myMessage}>
						<Typography variant="body2">
							Hello, my name is Billy Joe. Welcome!!!!!!!!!!!!!!!
						</Typography>
					</Box>
					<Box p={1} className={classes.myMessage}>
						<Typography variant="body2">
							Hello, my name is Billy Joe. Welcome!!!!!!!!!!!!!!!
						</Typography>
					</Box>
					<Box p={1} className={classes.userMessage}>
						<Typography variant="subtitle1">user123:</Typography>
						<Typography variant="body2">Hello, Good to see you!</Typography>
					</Box>
					<Box p={1} className={classes.userMessage}>
						<Typography variant="subtitle1">user123:</Typography>
						<Typography variant="body2">Hello, Good to see you!</Typography>
					</Box>
				</div>
				<TextField
					variant="outlined"
					fullWidth
					margin="dense"
					multiline
					InputProps={{
						endAdornment: (
							<IconButton
								onClick={() => {}}
								tabIndex={-1}
								style={{ padding: 0 }}
							>
								<AiOutlineSend color="green" />
							</IconButton>
						),
					}}
				/>
			</TabPanel>
			<TabPanel value={tab} index={1}>
				<div className={classes.logs}>
					<Typography variant="body2">
						[15:23:33] Event Blah blah blah blah blah blah
					</Typography>
					<Typography variant="body2">
						[15:23:33] Event Blah blah blah blah blah blah
					</Typography>
					<Typography variant="body2">
						[15:23:33] Event Blah blah blah blah blah blah
					</Typography>
					<Typography variant="body2">
						[15:23:33] Event Blah blah blah blah blah blah
					</Typography>
					<Typography variant="body2">
						[15:23:33] Event Blah blah blah blah blah blah
					</Typography>
					<Typography variant="body2">
						[15:23:33] Event Blah blah blah blah blah blah
					</Typography>
					<Typography variant="body2">
						[15:23:33] Event Blah blah blah blah blah blah
					</Typography>
					<Typography variant="body2">
						[15:23:33] Event Blah blah blah blah blah blah
					</Typography>
					<Typography variant="body2">
						[15:23:33] Event Blah blah blah blah blah blah
					</Typography>
					<Typography variant="body2">
						[15:23:33] Event Blah blah blah blah blah blah
					</Typography>
					<Typography variant="body2">
						[15:23:33] Event Blah blah blah blah blah blah
					</Typography>
					<Typography variant="body2">
						[15:23:33] Event Blah blah blah blah blah blah
					</Typography>
				</div>
			</TabPanel>
		</div>
	);
};

export default ChatLog;
