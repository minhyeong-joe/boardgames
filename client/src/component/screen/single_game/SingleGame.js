import React, { useEffect, useState } from "react";
import {
	Button,
	Container,
	FormLabel,
	Grid,
	IconButton,
	makeStyles,
} from "@material-ui/core";
import { useDispatch } from "react-redux";

import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import Input from "../../form/Input";
import { Field, Form } from "react-final-form";
import GameDetail from "./GameDetail";
import RoomTable from "./RoomTable";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		// temp
		border: "1px solid black",
	},
	createRoomBtn: {
		backgroundColor: theme.palette.success.main,
		"&:hover": {
			backgroundColor: theme.palette.success.dark,
		},
	},
}));

// mock-up rooms
const ROOMS = [
	{
		id: "1",
		name: "Room 1",
		password: "123",
		owner: "user123",
		maxOccupancy: 5,
		numMembers: 2,
	},
	{
		id: "2",
		name: "Room 2",
		password: "",
		owner: "test",
		maxOccupancy: 4,
		numMembers: 1,
	},
	{ id: "3", name: "Room 3", owner: "user", maxOccupancy: 4, numMembers: 2 },
	{
		id: "4",
		name: "Room 4",
		password: "abc",
		owner: "billy",
		maxOccupancy: 6,
		numMembers: 4,
	},
	{
		id: "5",
		name: "Room 5",
		password: "",
		owner: "owner12",
		maxOccupancy: 5,
		numMembers: 5,
	},
];

const SingleGame = ({ match }) => {
	console.log(match.params.gameId);
	const classes = useStyles();
	const dispatch = useDispatch();
	const [rooms, setRooms] = useState(ROOMS);

	const onSubmit = (values) => {
		if (values.search) {
			setRooms(
				ROOMS.filter((room) =>
					room.name.toLowerCase().includes(values.search.toLowerCase())
				)
			);
		} else {
			setRooms(ROOMS);
		}
	};

	useEffect(() => {
		console.log(rooms);
	}, [rooms]);

	return (
		<Container className={classes.root}>
			<GameDetail />
			<Grid container justify="space-between" alignItems="center">
				<Grid item>
					<Form onSubmit={onSubmit}>
						{({ handleSubmit }) => (
							<form onSubmit={handleSubmit}>
								<Grid container alignItems="center" spacing={1}>
									<Grid item>
										<FormLabel>Room Name:</FormLabel>
									</Grid>
									<Grid item>
										<Field
											name="search"
											label="Search"
											component={Input}
											InputProps={{
												endAdornment: (
													<IconButton tabIndex={-1} type="submit">
														<SearchIcon />
													</IconButton>
												),
											}}
										/>
									</Grid>
								</Grid>
							</form>
						)}
					</Form>
				</Grid>
				<Grid item>
					<Button
						variant="contained"
						color="primary"
						startIcon={<AddIcon />}
						className={classes.createRoomBtn}
					>
						Create a Room
					</Button>
				</Grid>
			</Grid>
			<RoomTable rooms={rooms} />
		</Container>
	);
};

export default SingleGame;
