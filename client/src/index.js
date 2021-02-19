import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

import { persistor, store } from "./store";

import App from "./component/App";
import Loading from "./component/Loading";

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={<Loading />} persistor={persistor}>
			<App />
		</PersistGate>
	</Provider>,
	document.querySelector("#root")
);
