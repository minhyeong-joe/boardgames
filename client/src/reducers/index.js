import { combineReducers } from "redux";

import authReducer from "./authReducer";
import modalReducer from "./modalReducer";

export default combineReducers({
	auth: authReducer,
	modal: modalReducer,
});
