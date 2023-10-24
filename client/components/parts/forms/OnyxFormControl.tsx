import { FormHelperText, InputBaseProps } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { HTMLInputTypeAttribute } from 'react';

export interface OnyxFormControlI {
	formik: any;
	label: string;
	attribute: string;
	type: HTMLInputTypeAttribute;
	Loader: JSX.Element;
	loadingState?: boolean;
	fullWidth?: boolean;
	inputProps?: InputBaseProps;
	fontWeight?: 'normal' | 'bold' | 'unset' | 'inherit' | 'initial';
}

/**
 * @IUnknown404I FormControl corporate component with InputLabel, OutlinedInput and ErrorsOutput elements inside.
 * @param props should be passed an Object:
 *  - formik: Object returned from useFormik();
 *  - label: string;
 *  - attribute: name of the formik schema key to be used;
 *  - type: HTMLInputTypeAttribute;
 *  - Loader: JSX.Element;
 *  - loadingState?: boolean || undefined. Will override 'disabled' value of passed inputProps if true passed;
 *  - fullWidth?: boolean;
 *  - inputProps?: InputBaseProps.
 *  - fontWeight?: 'normal' | 'bold' | 'unset' | 'inherit' | 'initial'. Will override default style.
 * @returns JSX.Element
 */
const OnyxFormControl = (props: OnyxFormControlI) => {
	return (
		<FormControl variant='outlined' fullWidth={props.fullWidth !== undefined ? props.fullWidth : true}>
			<InputLabel
				htmlFor={props.attribute}
				sx={props.attribute in props.formik?.errors ? { color: '#d63e3e' } : {}}
			>
				{props.label}
			</InputLabel>
			<OutlinedInput
				{...props.inputProps}
				fullWidth={props.fullWidth !== undefined ? props.fullWidth : true}
				id={props.attribute}
				disabled={!!props.loadingState ? true : props.loadingState || props.inputProps?.disabled}
				value={props.formik.values[props.attribute]}
				onChange={props.formik.handleChange}
				error={!!props.formik.errors[props.attribute]}
				type={props.type}
				label={props.label}
				sx={{ fontWeight: props.fontWeight || 'bold' }}
			/>
			{!!props.formik.errors[props.attribute] != null && (
				<FormHelperText error>
					{/* <FormHelperText error id='login-or-email-error'> */}
					{props.formik.errors[props.attribute]}
				</FormHelperText>
			)}
		</FormControl>
	);
};

export default OnyxFormControl;
