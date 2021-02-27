import React, { useEffect } from "react";

const PhaseTwo = ({ socket, gameState, room }) => {
	useEffect(() => {
		console.log("PHASE 2", gameState);
	}, [gameState]);

	return <div>Phase Two</div>;
};

export default PhaseTwo;
