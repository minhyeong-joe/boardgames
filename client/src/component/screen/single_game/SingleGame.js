import React from "react";

const SingleGame = ({ match }) => {
	console.log(match.params.gameId);
	return <div>Single Game</div>;
};

export default SingleGame;
