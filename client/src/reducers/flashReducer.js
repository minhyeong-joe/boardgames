/* eslint-disable import/no-anonymous-default-export */
import { SHOW_FLASH, CLOSE_FLASH } from "../actions/types";

export default (state = { show: false }, action) => {
	switch (action.type) {
		case SHOW_FLASH:
			return { show: true, ...action.payload };
		case CLOSE_FLASH:
			return { show: false };
		default:
			return state;
	}
};
