import React from "react";
import {
	Grid,
	IconButton,
	makeStyles,
	Modal as MUIModal,
	Paper,
	Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { closeModal } from "../../actions";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	modalBody: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		outline: "none",
		maxWidth: "600px",
	},
	modalHeader: {
		backgroundColor: theme.palette.primary,
	},
}));

const Modal = ({ open, title, children, cleanUp }) => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const handleClose = () => {
		if (cleanUp) {
			cleanUp();
		}
		dispatch(closeModal());
	};

	return (
		<MUIModal open={open} onClose={handleClose} className={classes.modal}>
			<Paper className={classes.modalBody}>
				<Grid container alignItems="center" className={classes.modalHeader}>
					<Grid item xs>
						<Typography variant="h5">{title}</Typography>
					</Grid>
					<Grid item>
						<IconButton onClick={() => dispatch(closeModal())}>
							<CloseIcon />
						</IconButton>
					</Grid>
				</Grid>
				{children}
			</Paper>
		</MUIModal>
	);
};

export default Modal;
