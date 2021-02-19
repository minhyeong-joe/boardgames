import React from "react";
import {
	FormControl,
	FormLabel,
	makeStyles,
	TextField,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	formControl: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	label: {
		marginBottom: theme.spacing(1),
	},
}));

const Input = ({
	input: { name, onChange, value, ...inputProps },
	meta,
	label,
	placeholder,
	...props
}) => {
	const classes = useStyles();
	return (
		<FormControl fullWidth className={classes.formControl}>
			<FormLabel className={classes.label}>{label}</FormLabel>
			<TextField
				{...props}
				inputProps={inputProps}
				variant="outlined"
				name={name}
				value={value}
				onChange={onChange}
				error={meta.error && meta.touched}
				helperText={meta.touched ? meta.error : ""}
				label={placeholder}
			/>
		</FormControl>
	);
};

export default Input;
