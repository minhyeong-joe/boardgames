import { combineReducers } from "redux";

import authReducer from "./authReducer";
import modalReducer from "./modalReducer";
import flashReducer from "./flashReducer";

export default combineReducers({
	auth: authReducer,
	modal: modalReducer,
	flash: flashReducer,
});
