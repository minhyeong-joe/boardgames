import axios from "axios";

export const USER_API = axios.create({
	baseURL: `${process.env.REACT_APP_API_ENDPOINT}/api/users`,
});
