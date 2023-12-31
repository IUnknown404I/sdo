import { Slider, styled } from '@mui/material';
import { ComponentProps } from 'react';

const colorsMap = {
	success: '#52af77',
	warn: '#ff8c00',
	error: '#d63e3e',
	primary: '#006fba',
};

interface OnyxSliderI extends ComponentProps<typeof Slider> {
	thumbSize?: number;
	trackHeight?: number;
	mode?: 'success' | 'warn' | 'error' | 'primary' | string;
	cursor?:
		| 'default'
		| 'context-menu'
		| 'help'
		| 'pointer'
		| 'progress'
		| 'wait'
		| 'cell'
		| 'crosshair'
		| 'text'
		| 'vertical-text'
		| 'copy'
		| 'move';
}

/**
 * @IUnknown404I Corporate Slider Element.
 * @param props as Basic MUI Slider props and custom attributes.
 * @returns slider-element as ReactNode.
 */
const OnyxRange = (props: OnyxSliderI) => {
	const sliderColor = !props.mode
		? colorsMap.primary
		: props.mode === 'success' || props.mode === 'warn' || props.mode === 'error' || props.mode === 'primary'
		? colorsMap[props.mode]
		: props.mode;

	const CustomSlider = styled(Slider)({
		color: sliderColor,
		height: props.trackHeight === undefined ? 8 : props.trackHeight,
		cursor: props.cursor || 'help',
		'& .MuiSlider-track': {
			border: 'none',
		},
		'& .MuiSlider-thumb': {
			height: props.thumbSize === undefined ? 24 : props.thumbSize,
			width: props.thumbSize === undefined ? 24 : props.thumbSize,
			backgroundColor: '#fff',
			border: '2px solid currentColor',
			'&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
				boxShadow: 'inherit',
			},
			'&:before': {
				display: 'none',
			},
		},
		'& .MuiSlider-valueLabel': {
			lineHeight: 1.2,
			fontSize: 12,
			background: 'unset',
			padding: 0,
			width: 32,
			height: 32,
			borderRadius: '50% 50% 50% 0',
			backgroundColor: sliderColor,
			transformOrigin: 'bottom left',
			transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
			'&:before': { display: 'none' },
			'&.MuiSlider-valueLabelOpen': {
				transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
			},
			'& > *': {
				transform: 'rotate(45deg)',
			},
		},
	});

	return <CustomSlider {...props} />;
};

export default OnyxRange;
