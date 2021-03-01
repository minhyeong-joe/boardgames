import React, { useEffect } from "react";

const PhaseThree = ({ socket, gameState, room }) => {
	useEffect(() => {
		console.log(gameState);
	}, [gameState]);

	return <div>Score Board</div>;
};

export default PhaseThree;
