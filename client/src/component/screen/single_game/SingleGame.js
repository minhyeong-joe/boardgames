import React from "react";
import { Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { openModal } from "../../../actions";
import { LOGIN_MODAL } from "../../modal/modalTypes";

const SingleGame = ({ match }) => {
	console.log(match.params.gameId);
	const dispatch = useDispatch();

	return (
		<Button
			variant="contained"
			onClick={() => dispatch(openModal(LOGIN_MODAL))}
		>
			Test
		</Button>
	);
};

export default SingleGame;
