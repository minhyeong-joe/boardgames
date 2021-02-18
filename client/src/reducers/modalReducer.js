/* eslint-disable import/no-anonymous-default-export */
import { CLOSE_MODAL, OPEN_MODAL } from "../actions/types";

export default (state = { show: false, modalName: null }, action) => {
	switch (action.type) {
		case OPEN_MODAL:
			return { show: true, modalName: action.payload };
		case CLOSE_MODAL:
			return { show: false, modalName: null };
		default:
			return state;
	}
};
