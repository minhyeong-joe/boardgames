/* eslint-disable import/no-anonymous-default-export */
import {
	LOGIN_USER,
	LOGOUT_USER,
	GET_USER_INFO,
	AUTHENTICATE_USER,
} from "../actions/types";

export default (state = { isLoggedIn: false }, action) => {
	switch (action.type) {
		case AUTHENTICATE_USER:
			if (action.payload.success) {
				return {
					success: true,
					userInfo: action.payload.userInfo,
				};
			}
			return action.payload;
		case LOGIN_USER:
			const { success, userInfo } = state;
			return { isLoggedIn: true, userInfo };
		case LOGOUT_USER:
			return action.payload;
		case GET_USER_INFO:
			return action.payload;
		default:
			return state;
	}
};
