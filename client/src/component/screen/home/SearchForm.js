import React, { useState } from "react";
import {
	Button,
	FormLabel,
	Grid,
	InputLabel,
	makeStyles,
	MenuItem,
} from "@material-ui/core";
import { Field, Form } from "react-final-form";
import Select from "../../form/Select";
import Input from "../../form/Input";

const useStyles = makeStyles((theme) => ({
	inlineLabel: {
		display: "inline-block",
	},
	btnGroup: {
		marginTop: theme.spacing(3),
		textAlign: "center",
		"&>button:first-child": {
			marginRight: theme.spacing(5),
			"@media screen and (max-width:300px)": {
				marginRight: theme.spacing(1),
			},
		},
	},
}));

const partySizeOptions = [
	{ value: "any", label: "Any" },
	{ value: 2, label: 2 },
	{ value: 3, label: 3 },
	{ value: 4, label: 4 },
	{ value: 5, label: 5 },
	{ value: 6, label: 6 },
	{ value: 7, label: 7 },
	{ value: 8, label: 8 },
	{ value: 9, label: 9 },
	{ value: 10, label: 10 },
];
const complexityOptions = [
	{ value: "any", label: "Any" },
	{ value: "easy", label: "Easy" },
	{ value: "medium", label: "Medium" },
	{ value: "hard", label: "Hard" },
	{ value: "geek", label: "Geek" },
];
const durationOptions = [
	{ value: "any", label: "Any" },
	{ value: "short", label: "Short" },
	{ value: "medium", label: "Medium" },
	{ value: "long", label: "Long" },
	{ value: "eternity", label: "Eternity" },
];

const SearchForm = ({ submit, initialFormValues }) => {
	const classes = useStyles();

	const onSubmit = (values) => {
		submit(values);
	};

	return (
		<Form onSubmit={onSubmit} initialValues={initialFormValues}>
			{({ handleSubmit, form, submitting }) => (
				<form onSubmit={handleSubmit}>
					<Grid container justify="center" alignItems="center" spacing={2}>
						<Grid item xs={12} sm={3}>
							<Field
								name="search"
								type="text"
								placeholder="Search"
								component={Input}
								className={classes.searchField}
								label="Game Name"
							/>
						</Grid>

						<Grid item xs={12} sm={3}>
							<Field component={Select} name="partySize" label="Party Size">
								{partySizeOptions.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</Field>
						</Grid>
						<Grid item xs={12} sm={3}>
							<Field component={Select} name="complexity" label="Complexity">
								{complexityOptions.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</Field>
						</Grid>
						<Grid item xs={12} sm={3}>
							<Field component={Select} name="duration" label="Duration">
								{durationOptions.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</Field>
						</Grid>
					</Grid>
					<div className={classes.btnGroup}>
						<Button
							variant="contained"
							type="submit"
							disabled={submitting}
							color="primary"
						>
							Search
						</Button>
						<Button
							variant="contained"
							onClick={() => {
								form.restart();
								form.submit();
							}}
							disabled={submitting}
						>
							Reset Filter
						</Button>
					</div>
				</form>
			)}
		</Form>
	);
};

export default SearchForm;
