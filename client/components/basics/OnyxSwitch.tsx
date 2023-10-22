import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import React from 'react';

const AndroidSwitch = styled(Switch)(({ theme, size }) => ({
	padding: 8,
	'& .MuiSwitch-track': {
		borderRadius: 22 / 2,
		'&:before, &:after': {
			content: '""',
			position: 'absolute',
			top: '50%',
			transform: 'translateY(-50%)',
			width: size === 'small' ? 12 : 16,
			height: size === 'small' ? 12 : 16,
		},
		'&:before': {
			content: size === 'small' ? 'unset' : undefined,
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
				theme.palette.getContrastText(theme.palette.primary.main),
			)}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
			left: 12,
		},
		'&:after': {
			content: size === 'small' ? 'unset' : undefined,
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
				theme.palette.getContrastText(theme.palette.primary.main),
			)}" d="M19,13H5V11H19V13Z" /></svg>')`,
			right: 12,
		},
	},
	'& .MuiSwitch-thumb': {
		boxShadow: 'none',
		width: size === 'small' ? 12 : 16,
		height: size === 'small' ? 12 : 16,
		margin: 2,
	},
}));

/**
 * @IUnknown404I Corporate Switch component.
 * @param props as config Object:
	- disabled?: boolean;
	- state: boolean;
	- setState: Function;
	- label: string;
	- labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
	- onClick?: void function.
 * @returns JSX.Element as Standart Switch component.
 */
const OnyxSwitch = (props: OnyxSwitchI) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		props.setState(event.target.checked);
	};

	return (
		<FormControlLabel
			label={props.label}
			labelPlacement={props.labelPlacement}
			sx={{
				display: 'flex',
				justifyContent: 'flex-start',
				width: '100%',
				gap: '.5rem',
				'span:nth-child(2)': {
					display: 'flex',
					justifyContent: 'flex-start',
					alignContent: 'center',
					alignItems: 'center',
					fontSize: props.size === 'small' ? '.75rem' : '',
				},
			}}
			control={
				<AndroidSwitch
					size={props.size}
					disabled={props.disabled}
					checked={props.state}
					onChange={handleChange}
					onClick={props.onClick}
				/>
			}
		/>
	);
};

export interface OnyxSwitchI {
	disabled?: boolean;
	state: boolean;
	setState: Function;
	label: string;
	size?: 'small' | 'medium';
	labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	// formProps?: FormControlLabelProps;
}

export default OnyxSwitch;
