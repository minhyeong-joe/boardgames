import React, { useEffect, useState } from "react";
import { Button, Container, Grid, makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";

import AddIcon from "@material-ui/icons/Add";
import CachedIcon from "@material-ui/icons/Cached";
import Input from "../../form/Input";
import { Field, Form } from "react-final-form";
import GameDetail from "./GameDetail";
import RoomTable from "./RoomTable";
import CheckBox from "../../form/CheckBox";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	createRoomBtn: {
		backgroundColor: theme.palette.success.main,
		marginBottom: theme.spacing(2),
		"&:hover": {
			backgroundColor: theme.palette.success.dark,
		},
	},
	[theme.breakpoints.down("sm")]: {
		btnGroup: {
			justifyContent: "center",
			marginTop: theme.spacing(1),
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
		if (values.search === undefined) {
			values.search = "";
		}
		setRooms(
			ROOMS.filter(
				(room) =>
					room.name.toLowerCase().includes(values.search.toLowerCase()) &&
					(values.showPrivate || !room.password) &&
					(values.showFull || room.maxOccupancy > room.numMembers)
			)
		);
	};

	return (
		<Container className={classes.root}>
			<GameDetail />
			<Form
				onSubmit={onSubmit}
				initialValues={{ search: "", showPrivate: true, showFull: true }}
			>
				{({ handleSubmit, values }) => (
					<form onSubmit={handleSubmit}>
						<Grid
							container
							justify="center"
							alignItems="center"
							spacing={1}
							className={classes.formRow}
						>
							<Grid item xs={10} sm={10} md="auto">
								<Field
									name="search"
									placeholder="Search"
									component={Input}
									label="Room Name"
								/>
							</Grid>
							<Grid item xs={10} sm={5} md="auto">
								<Field name="showPrivate" type="checkbox">
									{({ input, meta }) => (
										<CheckBox {...input} label="Show Private Room" />
									)}
								</Field>
							</Grid>
							<Grid item xs={10} sm={5} md="auto">
								<Field name="showFull" type="checkbox">
									{({ input, meta }) => (
										<CheckBox {...input} label="Show Full Room" />
									)}
								</Field>
							</Grid>
						</Grid>
						<Grid
							container
							justify="flex-end"
							spacing={2}
							className={classes.btnGroup}
						>
							<Grid item>
								<Button
									variant="contained"
									color="primary"
									startIcon={<CachedIcon />}
									type="submit"
								>
									Refresh
								</Button>
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
					</form>
				)}
			</Form>

			<RoomTable rooms={rooms} />
		</Container>
	);
};

export default SingleGame;
