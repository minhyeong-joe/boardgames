import React, { useEffect, useState } from "react";
import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";

import images from "../../../assets/image";
import BGCard from "./BGCard";
import { FaRegSurprise } from "react-icons/fa";

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

// temp fake boardgame data
const boardgames = [
	{
		id: 1,
		image_url: images.boardgame1,
		name: "Board Game 1",
		min: 2,
		max: 5,
		complexity: "easy",
		duration: "medium",
	},
	{
		id: 2,
		image_url: images.boardgame1,
		name: "Board Game 2",
		min: 2,
		max: 8,
		complexity: "hard",
		duration: "long",
	},
	{
		id: 3,
		image_url: images.boardgame1,
		name: "Board Game 3",
		min: 2,
		max: 4,
		complexity: "easy",
		duration: "short",
	},
	{
		id: 4,
		image_url: images.boardgame1,
		name: "Board Game 4",
		min: 3,
		max: 10,
		complexity: "medium",
		duration: "long",
	},
	{
		id: 5,
		image_url: images.boardgame1,
		name: "Board Game 5",
		min: 4,
		max: 8,
		complexity: "easy",
		duration: "medium",
	},
];

const BoardGameList = ({ filter }) => {
	const classes = useStyles();
	const [boardGames, setBoardGames] = useState(boardgames);

	useEffect(() => {
		setBoardGames(
			boardgames.filter(
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
	}, [filter]);

	return (
		<Grid
			container
			justify="flex-start"
			alignItems="center"
			spacing={2}
			className={classes.container}
		>
			{boardGames.length > 0 ? (
				boardGames.map((bg) => (
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
