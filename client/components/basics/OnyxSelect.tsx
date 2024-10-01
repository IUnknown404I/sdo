import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	SxProps,
} from '@mui/material';
import React from 'react';
import { OnyxTypography } from './OnyxTypography';

const flexBase: SxProps = {
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'flex-start',
	alignItems: 'center',
	gap: '.75rem',
	flexWrap: { xs: 'wrap', lg: 'nowrap' },
};

interface OnyxSelectProps {
	id?: string;
	listItems: string[];
	value: string | number;
	setValue: (e: SelectChangeEvent<string | number>) => void;
	itemsIndexes?: (string | number)[];
	initialIndex?: string | number;
	size?: 'small' | 'medium';
	disabled?: boolean;
	reversed?: boolean;
	label?: string;
	labelPlacement?: 'bottom' | 'top' | 'end' | 'start';
	disableEmptyOption?: boolean;
	helperText?: {
		text: string;
		type?: 'text' | 'button';
		containerSx?: SxProps;
	};
	fullwidth?: boolean;
	error?: boolean;
}

/**
 * @IUnknown404I Corporate Switch component.
 * @param props as config Object:
 	- listItems: string[] that will be presented as options in menu;
	- value: as an value of select. Only for controlled select;
	- setValue: as onChange function for select component. Only for controlled select;
	- itemsIndexes?: (number|string)[] as array of indexes for list items;
	- initialIndex?: number|string as initial index of selected menu option. Only for uncontrollable select;
	- size?: 'small' | 'medium' as size of MUI component;
	- disabled?: boolean;
	- reversed?: boolean - initially displaing select and text after; if passed true will be reversed;
	- label?: string as built-in MUI label attribute;
	- labelPlacement?: 'bottom' | 'top' | 'end' | 'start' as built-in MUI label-placement attribute;
	- helperText?: that option creates button on interactive text with onClick event that will open the menu too. Passed as Object: {
		text: string;
		type?: 'text' | 'button';
		containerSx?: SxProps;
 * @returns JSX.Element as Switch node.
 */
const OnyxSelect = (props: OnyxSelectProps): JSX.Element => {
	const [val, setVal] = React.useState<string | number>(props.initialIndex === undefined ? -1 : props.initialIndex);
	const [open, setOpen] = React.useState<boolean>(false);

	const handleChange = (event: SelectChangeEvent<typeof val>) => {
		if (props.setValue != null) props.setValue(event);
		else setVal(event.target.value);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	return props.helperText != null && props.helperText.type === 'button' ? (
		<Box sx={{ ...flexBase, ...props.helperText?.containerSx }}>
			{props.reversed == null && <MainBlock />}
			<Button
				size='large'
				variant='text'
				color={!!props.error ? 'error' : undefined}
				onClick={handleOpen}
				sx={{
					display: 'inline',
					mt: 2,
					textTransform: 'none',
					color: 'inherit',
					fontSize: '1.15rem',
					marginTop: '0',
					marginLeft: props.reversed ? '0' : '.5rem',
					marginRight: props.reversed ? '.5rem' : '0',
				}}
			>
				{props.helperText.text}
			</Button>
			{props.reversed != null && <MainBlock />}
		</Box>
	) : props.helperText != null && (props.helperText.type === undefined || props.helperText.type === 'text') ? (
		<Box sx={{ ...flexBase, ...props.helperText?.containerSx }}>
			{props.reversed == null && <MainBlock />}
			<OnyxTypography
				onClick={handleOpen}
				tpColor={!!props.error ? 'error' : undefined}
				sx={{ cursor: 'pointer' }}
			>
				{props.helperText.text}
			</OnyxTypography>
			{props.reversed != null && <MainBlock />}
		</Box>
	) : (
		<MainBlock />
	);

	function MainBlock(): JSX.Element {
		return (
			<FormControl fullWidth={props.fullwidth}>
				{props.label != null ? (
					<FormControlLabel
						label={props.label}
						labelPlacement={props.labelPlacement || 'start'}
						control={<SelectElement />}
						// onClick={() => setOpen(prev => !prev)}
						sx={{
							gap:
								props.labelPlacement === 'top' || props.labelPlacement === 'bottom'
									? '.15rem'
									: '.5rem',
							'> span': {
								cursor: 'text',
								alignSelf:
									props.labelPlacement === 'top' || props.labelPlacement === 'bottom'
										? 'flex-start'
										: 'center',
								whiteSpace: props.fullwidth ? 'nowrap' : '',
							},
						}}
					/>
				) : (
					<SelectElement />
				)}
			</FormControl>
		);
	}

	function SelectElement(): JSX.Element {
		return (
			<Select
				fullWidth={props.fullwidth}
				id={props.id}
				error={props.error}
				disabled={props.disabled}
				disableUnderline
				variant='outlined'
				size={props.size || 'small'}
				open={open}
				value={props.value !== undefined ? props.value : val}
				onOpen={handleOpen}
				onClose={handleClose}
				onChange={handleChange}
				sx={{ minWidth: '175px', fieldset: { borderColor: '#7FB7DC' } }}
			>
				{!!!props.disableEmptyOption && (
					<MenuItem disabled={props.disabled} value={-1}>
						<em>Не указано</em>
					</MenuItem>
				)}
				{props.listItems.map((el, index) => (
					<MenuItem
						disabled={props.disabled}
						value={props.itemsIndexes == null ? index : props.itemsIndexes[index]}
						key={el + '' + (props.itemsIndexes == null ? index : props.itemsIndexes[index])}
					>
						{el}
					</MenuItem>
				))}
			</Select>
		);
	}
};

export default OnyxSelect;
