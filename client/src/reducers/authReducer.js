/* eslint-disable import/no-anonymous-default-export */
import { LOGIN_USER, LOGOUT_USER, GET_USER_INFO } from "../actions/types";

export default (state = { isLoggedIn: false }, action) => {
	switch (action.type) {
		case LOGIN_USER:
			if (action.payload.success) {
				return { isLoggedIn: true, userInfo: action.payload.userInfo };
			}
			return action.payload;
		case LOGOUT_USER:
			return action.payload;
		case GET_USER_INFO:
			return action.payload;
		default:
			return state;
	}
};
