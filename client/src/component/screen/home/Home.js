import React, { useEffect, useState } from "react";
import { Container, makeStyles } from "@material-ui/core";
import SearchForm from "./SearchForm";
import BoardGameList from "./BoardGameList";

import boardGames from "../../../games/games";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		boxShadow: "0 0 5px #777",
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4),
		padding: theme.spacing(3),
	},
	hr: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
		borderTop: `1px solid ${theme.palette.grey[300]}`,
		boxShadow: `0 0 5px 1px ${theme.palette.grey[200]}`,
	},
}));

const DEFAULT_FILTER = {
	search: "",
	partySize: "any",
	complexity: "any",
	duration: "any",
};

const Home = () => {
	const classes = useStyles();
	const [filter, setFilter] = useState(DEFAULT_FILTER);
	const [filteredBoardGames, setFilteredBoardGames] = useState([]);

	useEffect(() => {
		setFilteredBoardGames(
			boardGames.filter(
				(boardgame) =>
					(!filter.search ||
						boardgame.name
							.toLowerCase()
							.includes(filter.search.toLowerCase())) &&
					(filter.partySize === "any" ||
						(filter.partySize >= boardgame.min &&
							filter.partySize <= boardgame.max)) &&
					(filter.complexity === "any" ||
						filter.complexity === boardgame.complexity) &&
					(filter.duration === "any" || filter.duration === boardgame.duration)
			)
		);

		return () => {
			// cleanup
		};
	}, [filter]);

	const handleFilterChange = (newFilter) => {
		setFilter(newFilter);
	};

	return (
		<Container className={classes.root}>
			<SearchForm
				submit={handleFilterChange}
				initialFormValues={DEFAULT_FILTER}
			/>
			<hr className={classes.hr} />
			<BoardGameList boardGames={filteredBoardGames} />
		</Container>
	);
};

export default Home;
