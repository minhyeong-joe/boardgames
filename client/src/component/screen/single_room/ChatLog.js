import React, { useEffect, useState } from "react";
import {
	AppBar,
	Box,
	FormControlLabel,
	IconButton,
	makeStyles,
	Switch,
	Tab,
	Tabs,
	TextField,
	Typography,
} from "@material-ui/core";
import { AiOutlineSend } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useImmer } from "use-immer";
import moment from "moment";
import { openModal } from "../../../actions";
import { LOGIN_MODAL } from "../../modal/modalTypes";

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
	const dispatch = useDispatch();
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

		socket?.on("log", (log) => {
			console.log(log);
			setLogs((logs) => {
				return [...logs, log];
			});
			scrollToBottom();
		});

		return () => {
			socket?.off();
		};
	}, [socket, setMessages, setLogs, autoscroll]);

	useEffect(() => {
		scrollToBottom();
	}, [tab, autoscroll]);

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
		if (auth.isLoggedIn) {
			socket.emit("sendMessage", {
				senderId: auth.userInfo._id,
				sendername: auth.userInfo.username,
				content: input,
			});
			setInput("");
		} else {
			dispatch(openModal({ modalName: LOGIN_MODAL }));
		}
	};

	const handleSwitchCheck = (e) => {
		setAutoscroll(e.target.checked);
	};

	const scrollToBottom = () => {
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
					{messages &&
						auth.isLoggedIn &&
						messages.map((message, index) => {
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
					control={<Switch checked={autoscroll} onChange={handleSwitchCheck} />}
				/>
			</TabPanel>
			<TabPanel value={tab} index={1}>
				<div className={classes.logs} id="messages">
					{logs &&
						auth.isLoggedIn &&
						logs.map((log) => {
							return (
								<Typography variant="body2" key={log.timestamp}>
									{`[${moment(log.timestamp).format("HH:mm:ss")}] ${
										log.message
									}`}
								</Typography>
							);
						})}
				</div>
				<FormControlLabel
					label="Auto-scroll"
					control={<Switch checked={autoscroll} onChange={handleSwitchCheck} />}
				/>
			</TabPanel>
		</div>
	);
};

export default ChatLog;
