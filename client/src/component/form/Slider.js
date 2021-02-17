import React from "react";
import {
	FormControl,
	FormLabel,
	makeStyles,
	Slider as MUISlider,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
}));

const Slider = ({ label, name, value, onChange, ...props }) => {
	const classes = useStyles();

	return (
		<FormControl fullWidth className={classes.root}>
			<FormLabel>{label}</FormLabel>
			<MUISlider
				{...props}
				name={name}
				value={value}
				onChange={onChange}
				valueLabelDisplay="auto"
				marks
			/>
		</FormControl>
	);
};

export default Slider;
