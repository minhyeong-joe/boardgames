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

const BoardGameList = ({ boardGames }) => {
	const classes = useStyles();

	return (
		<Grid
			container
			justify="flex-start"
			alignItems="center"
			spacing={2}
			className={classes.container}
		>
			{boardGames.length > 0 ? (
				boardGames.map((boardgame) => (
					<Grid key={boardgame.id} item xs={12} sm={6} md={3}>
						<BGCard boardgame={boardgame} />
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
