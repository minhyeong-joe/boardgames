import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	AppBar,
	Box,
	FormControl,
	FormControlLabel,
	Grid,
	IconButton,
	makeStyles,
	Switch,
	Tab,
	Tabs,
	TextField,
	Typography,
} from "@material-ui/core";
import { AiOutlineSend } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useImmer } from "use-immer";
import CheckBox from "../../form/CheckBox";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: "240px",
		boxShadow: `0 0 5px ${theme.palette.grey[500]}`,
	},
	messages: {
		height: "300px",
		overflowY: "scroll",
		paddingRight: "5px",
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

const ChatLog = ({ socket }) => {
	const classes = useStyles();
	const auth = useSelector((state) => state.auth);
	const [tab, setTab] = useState(0);
	const [messages, setMessages] = useImmer([]);
	const [logs, setLogs] = useImmer([]);
	const [input, setInput] = useState("");
	const [autoscroll, setAutoscroll] = useState(true);

	useEffect(() => {
		socket?.on("message", (message) => {
			setMessages((msgs) => {
				return [...msgs, message];
			});
			scrollToBottom();
		});

		return () => {
			socket?.off();
		};
	}, [socket, setMessages, autoscroll]);

	const handleTabChange = (e, newVal) => {
		setTab(newVal);
	};

	const handleEnterKey = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (input && input.length <= 100) {
				sendMessage();
			}
		}
	};

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const sendMessage = () => {
		socket.emit("sendMessage", {
			senderId: auth.userInfo._id,
			sendername: auth.userInfo.username,
			content: input,
		});
		setInput("");
	};

	const scrollToBottom = () => {
		console.log(autoscroll);
		if (autoscroll) {
			document.getElementById("messages").scrollTop = document.getElementById(
				"messages"
			).scrollHeight;
		}
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
				<div className={classes.messages} id="messages">
					{messages?.map((message, index) => {
						const isMyMessage = auth.userInfo._id === message.senderId;
						return (
							<Box
								p={1}
								className={
									isMyMessage ? classes.myMessage : classes.userMessage
								}
								key={index}
							>
								<Typography variant="body2" component={"span"}>
									{isMyMessage ? null : (
										<Typography variant="subtitle1">
											{message.sendername}:
										</Typography>
									)}
									{message.content}
								</Typography>
							</Box>
						);
					})}
				</div>
				<div style={{ float: "left", clear: "both" }} />
				<TextField
					variant="outlined"
					fullWidth
					margin="dense"
					multiline
					value={input}
					onChange={handleInputChange}
					inputProps={{ maxLength: 100 }}
					onKeyPress={handleEnterKey}
					helperText={`${input.length}/100 Characters`}
					InputProps={{
						endAdornment: (
							<IconButton
								onClick={sendMessage}
								tabIndex={-1}
								style={{ padding: 0 }}
								disabled={!input || input.length > 100}
							>
								<AiOutlineSend
									color={input && input.length <= 100 ? "green" : "gray"}
								/>
							</IconButton>
						),
					}}
				/>
				<FormControlLabel
					label="Auto-scroll"
					control={
						<Switch
							checked={autoscroll}
							onChange={(e) => {
								setAutoscroll(e.target.checked);
								if (e.target.checked) {
									document.getElementById(
										"messages"
									).scrollTop = document.getElementById(
										"messages"
									).scrollHeight;
								}
							}}
						/>
					}
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
