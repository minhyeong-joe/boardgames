import React from "react";
import { FormControl, makeStyles, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	formControl: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
}));

const Input = ({ label, name, value, handleInputChange, type, ...props }) => {
	const classes = useStyles();
	return (
		<FormControl fullWidth className={classes.formControl}>
			<TextField
				type={type}
				label={label}
				name={name}
				variant="outlined"
				value={value}
				onChange={handleInputChange}
				{...props}
			/>
		</FormControl>
	);
};

export default Input;
