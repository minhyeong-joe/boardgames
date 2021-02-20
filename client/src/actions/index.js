import {
	LOGIN_USER,
	AUTHENTICATE_USER,
	LOGOUT_USER,
	GET_USER_INFO,
	OPEN_MODAL,
	CLOSE_MODAL,
	SHOW_FLASH,
	CLOSE_FLASH,
} from "./types";
import { USER_API } from "../axios";

// AUTH
export const authenticateUser = (credentials) => async (dispatch) => {
	const { data } = await USER_API.post("/login", credentials, {
		withCredentials: true,
	});
	dispatch({ type: AUTHENTICATE_USER, payload: data });
};

export const loginUser = () => {
	return {
		type: LOGIN_USER,
	};
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
export const openModal = ({ modalName, data }) => {
	return {
		type: OPEN_MODAL,
		payload: { modalName, data },
	};
};

export const closeModal = () => {
	return {
		type: CLOSE_MODAL,
	};
};

// FLASH
export const showFlash = ({
	message,
	severity,
	duration,
	horizontal,
	vertical,
	closeIcon,
}) => {
	return {
		type: SHOW_FLASH,
		payload: { message, severity, duration, horizontal, vertical, closeIcon },
	};
};

export const closeFlash = () => {
	return {
		type: CLOSE_FLASH,
	};
};
