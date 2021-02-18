export const required = (value) =>
	value ? undefined : "This field is Required";

export const range = (min, max) => (value) =>
	value.length >= min && value.length <= max
		? undefined
		: `Must be between ${min}-${max} characters`;

export const matching = (valueToCompare, errorMessage) => (value) =>
	value === valueToCompare ? undefined : errorMessage;

export const composeValidators = (...validators) => (value) =>
	validators.reduce((error, validator) => error || validator(value), undefined);
