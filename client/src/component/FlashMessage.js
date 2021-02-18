import React from "react";
import { IconButton, Snackbar } from "@material-ui/core";
import { CloseIcon } from "@material-ui/icons/Close";
import { Alert } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { closeFlash } from "../actions";

const FlashMessage = () => {
	const dispatch = useDispatch();
	const flash = useSelector((state) => state.flash);

	const handleClose = () => {
		dispatch(closeFlash());
	};

	return (
		<Snackbar
			autoHideDuration={flash.duration}
			anchorOrigin={{
				vertical: flash.vertical || "top",
				horizontal: flash.horizontal || "center",
			}}
			open={flash.show}
			onClose={handleClose}
		>
			<Alert
				onClose={flash.closeIcon ? handleClose : null}
				severity={flash.severity || "success"}
			>
				{flash.message}
			</Alert>
		</Snackbar>
	);
};

export default FlashMessage;
