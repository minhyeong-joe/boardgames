import React from "react";
import {
	FormControl,
	FormHelperText,
	FormLabel,
	makeStyles,
	Select as MUISelect,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	label: {
		marginBottom: theme.spacing(1),
	},
}));

const Select = ({
	input: { name, value, onChange, ...inputProps },
	meta,
	label,
	...props
}) => {
	const classes = useStyles();
	return (
		<FormControl fullWidth className={classes.root}>
			<FormLabel className={classes.label} error={meta.error && meta.touched}>
				{label}
			</FormLabel>
			<MUISelect
				{...inputProps}
				{...props}
				value={value}
				onChange={onChange}
				variant="outlined"
				error={meta.error && meta.touched}
			/>
			{meta.touched && meta.error ? (
				<FormHelperText>{meta.error}</FormHelperText>
			) : null}
		</FormControl>
	);
};

export default Select;
