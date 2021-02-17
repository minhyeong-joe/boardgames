import React from "react";
import { FormControl, makeStyles, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	formControl: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
}));

const Input = ({
	input: { name, onChange, value, ...inputProps },
	meta,
	label,
	...props
}) => {
	const classes = useStyles();
	return (
		<FormControl fullWidth className={classes.formControl}>
			<TextField
				{...props}
				inputProps={inputProps}
				variant="outlined"
				name={name}
				value={value}
				onChange={onChange}
				error={meta.error && meta.touched}
				helperText={meta.touched ? meta.error : ""}
				label={label}
			/>
		</FormControl>
	);
};

export default Input;
