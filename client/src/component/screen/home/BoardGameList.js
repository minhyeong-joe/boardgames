import React, { useEffect, useState } from "react";
import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { FaRegSurprise } from "react-icons/fa";

import BGCard from "./BGCard";
import GAMES from "../../../games/games";

const useStyles = makeStyles((theme) => ({
	container: {
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
	},
	infoPaper: {
		backgroundColor: theme.palette.warning.light,
		padding: theme.spacing(3),
		marginLeft: "auto",
		marginRight: "auto",
	},
}));

const BoardGameList = ({ filter }) => {
	const classes = useStyles();
	const [boardGames, _] = useState(GAMES);
	const [filteredBoardGames, setFilteredBoardGames] = useState(boardGames);

	useEffect(() => {
		setFilteredBoardGames(
			boardGames.filter(
				(bg) =>
					(!filter.search ||
						bg.name.toLowerCase().includes(filter.search.toLowerCase())) &&
					(filter.partySize === "any" ||
						(filter.partySize >= bg.min && filter.partySize <= bg.max)) &&
					(filter.complexity === "any" ||
						filter.complexity === bg.complexity) &&
					(filter.duration === "any" || filter.duration === bg.duration)
			)
		);
	}, [boardGames, filter]);

	return (
		<Grid
			container
			justify="flex-start"
			alignItems="center"
			spacing={2}
			className={classes.container}
		>
			{filteredBoardGames.length > 0 ? (
				filteredBoardGames.map((bg) => (
					<Grid key={bg.id} item xs={12} sm={6} md={3}>
						<BGCard bg={bg} />
					</Grid>
				))
			) : (
				<Paper className={classes.infoPaper}>
					<Typography variant="body1">
						<FaRegSurprise
							size="20px"
							style={{ verticalAlign: "middle", marginRight: "10px" }}
						/>
						There is no board games matching given filter.
					</Typography>
				</Paper>
			)}
		</Grid>
	);
};

export default BoardGameList;
