import React from "react";
import { Checkbox, FormControl, FormControlLabel } from "@material-ui/core";

const CheckBox = ({ label, name, checked, onChange, ...props }) => {
	return (
		<FormControl fullWidth>
			<FormControlLabel
				control={
					<Checkbox
						{...props}
						checked={checked}
						name={name}
						onChange={onChange}
					/>
				}
				label={label}
			/>
		</FormControl>
	);
};

export default CheckBox;
