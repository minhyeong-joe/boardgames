import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
	makeStyles,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Typography,
} from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../../actions";
import { LOGIN_MODAL } from "../../modal/modalTypes";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1,
	},
	fullRoom: {
		"& *": {
			color: theme.palette.error.main,
		},
	},
	availableRoom: {
		cursor: "pointer",
		"& *": {
			color: theme.palette.success.dark,
		},
	},
}));

const RoomTable = ({ rooms }) => {
	const history = useHistory();
	const classes = useStyles();
	const dispatch = useDispatch();
	const auth = useSelector((state) => state.auth);
	const [order, setOrder] = useState("asc");
	const [orderBy, setOrderBy] = useState("name");
	const [page, setPage] = useState(0);
	const ROWS_PER_PAGE = 10;

	useEffect(() => {
		setPage(0);
	}, [rooms]);

	const createSortHandler = (property) => (event) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const descendingComparator = (a, b, orderBy) => {
		if (b[orderBy] < a[orderBy]) {
			return -1;
		}
		if (b[orderBy] > a[orderBy]) {
			return 1;
		}
		return 0;
	};

	const getComparator = (order, orderBy) => {
		return order === "desc"
			? (a, b) => descendingComparator(a, b, orderBy)
			: (a, b) => -descendingComparator(a, b, orderBy);
	};

	const stableSort = (array, comparator) => {
		const stabilizedThis = array.map((el, index) => [el, index]);
		stabilizedThis.sort((a, b) => {
			const order = comparator(a[0], b[0]);
			if (order !== 0) return order;
			return a[1] - b[1];
		});
		return stabilizedThis.map((el) => el[0]);
	};

	const onRoomClick = (id, isPrivate) => {
		if (auth.isLoggedIn) {
			if (isPrivate) {
				console.log("Enter Password for Room");
			}
			console.log(`Room ID ${id} Clicked`);
			history.push(`/room/${id}`);
		} else {
			dispatch(openModal(LOGIN_MODAL));
		}
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	return (
		<div className={classes.root}>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell align="center" padding="checkbox">
								<LockIcon />
							</TableCell>
							<TableCell sortDirection={order}>
								<TableSortLabel
									active={orderBy === "name"}
									direction={orderBy === "name" ? order : "asc"}
									onClick={createSortHandler("name")}
								>
									<Typography variant="h5">Room Name</Typography>
									{orderBy === "name" ? (
										<span className={classes.visuallyHidden}>
											{order === "desc"
												? "sorted descending"
												: "sorted ascending"}
										</span>
									) : null}
								</TableSortLabel>
							</TableCell>
							<TableCell sortDirection={order} align="center">
								<TableSortLabel
									active={orderBy === "owner"}
									direction={orderBy === "owner" ? order : "asc"}
									onClick={createSortHandler("owner")}
								>
									<Typography variant="h5">Owner</Typography>
									{orderBy === "owner" ? (
										<span className={classes.visuallyHidden}>
											{order === "desc"
												? "sorted descending"
												: "sorted ascending"}
										</span>
									) : null}
								</TableSortLabel>
							</TableCell>
							<TableCell sortDirection={order} align="center">
								<TableSortLabel
									active={orderBy === "numMembers"}
									direction={orderBy === "numMembers" ? order : "asc"}
									onClick={createSortHandler("numMembers")}
								>
									<Typography variant="h5">Occupancy</Typography>
									{orderBy === "numMembers" ? (
										<span className={classes.visuallyHidden}>
											{order === "desc"
												? "sorted descending"
												: "sorted ascending"}
										</span>
									) : null}
								</TableSortLabel>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{stableSort(rooms, getComparator(order, orderBy))
							.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)
							.map((room, index) => {
								const isRoomFull = room.numMembers === room.maxOccupancy;
								return (
									<TableRow
										hover={!isRoomFull}
										tabIndex={-1}
										key={room._id}
										className={
											isRoomFull ? classes.fullRoom : classes.availableRoom
										}
										onClick={
											isRoomFull
												? null
												: () => onRoomClick(room._id, room.isPrivate)
										}
									>
										<TableCell align="center">
											{room.isPrivate ? <LockIcon /> : <LockOpenIcon />}
										</TableCell>
										<TableCell>
											<Typography variant="body1">{room.name}</Typography>
										</TableCell>
										<TableCell align="center">
											<Typography variant="body1">{room.owner}</Typography>
										</TableCell>
										<TableCell align="center">
											<Typography variant="body1">
												{`${room.numMembers}/${room.maxOccupancy}`}
											</Typography>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component="div"
				count={rooms.length}
				rowsPerPage={ROWS_PER_PAGE}
				page={page}
				onChangePage={handleChangePage}
				rowsPerPageOptions={[]}
			/>
		</div>
	);
};

export default RoomTable;
