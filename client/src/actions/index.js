import {
	LOGIN_USER,
	LOGOUT_USER,
	GET_USER_INFO,
	OPEN_MODAL,
	CLOSE_MODAL,
} from "./types";
import { USER_API } from "./axios";

// AUTH
export const loginUser = (credentials) => async (dispatch) => {
	const { data } = await USER_API.post("/login", credentials, {
		withCredentials: true,
	});
	dispatch({ type: LOGIN_USER, payload: data });
};

export const getUserInfo = () => async (dispatch) => {
	const { data } = await USER_API.get("/auth", { withCredentials: true });
	dispatch({ type: GET_USER_INFO, payload: data });
};

export const logoutUser = () => async (dispatch) => {
	const { data } = await USER_API.post("/logout", null, {
		withCredentials: true,
	});
	dispatch({ type: LOGOUT_USER, payload: data });
};

// MODAL
export const openModal = (modalName) => async (dispatch) => {
	dispatch({
		type: OPEN_MODAL,
		payload: modalName,
	});
};

export const closeModal = () => {
	return {
		type: CLOSE_MODAL,
	};
};
