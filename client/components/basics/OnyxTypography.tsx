import { Box, ClickAwayListener, SxProps, Theme, Tooltip, Typography, Zoom, useTheme } from '@mui/material';
import Link from 'next/link';
import React, { AriaAttributes, ElementType, HTMLAttributeAnchorTarget, ReactNode } from 'react';

/**
 * @IUnknown404I Returns corporate link component. Can be restyled and wrapped by tooltip or wrapped by box wrapper according props attributes.
 * @default props:
 * - defaults: sx = undefined, hoverStyles = undefined
 * - typography: tpVariant = 'body2', align = 'left' and tpColor = undefined, fontSize = 'initial';
 * - link: lkHref = undefined;
 * - tooltip: ttNode = undefined, ttOnClickMode = false; ttFollow = true if ttNode passed, ttPlacement = 'bottom';
 * - box wrapper: boxWrapper = false, boxAlign and boxVerticalAlign = 'flex-start', boxWidth = '100%';
 * @returns MUI Typography wrapped with the Link \ tooltip or box components.
 */
export const OnyxTypography = (props: OnyxTypographyI) => {
	const theme = useTheme();
	const [tooltipState, setTooltipState] = React.useState<boolean>(false);

	let component = (
		<Typography
			id={props.id}
			{...props.ariaProps}
			component={props.component || (props.boxWrapper ? 'div' : 'p')}
			color={
				props.tpColor === 'warning'
					? theme.palette.warning.main
					: props.tpColor === 'error'
					? theme.palette.error.main
					: props.tpColor === 'success'
					? theme.palette.success.main
					: props.tpColor || (props.lkHref ? 'primary' : undefined)
			}
			fontSize={props.tpSize}
			fontWeight={props.tpWeight}
			variant={props.tpVariant || 'body2'}
			align={props.tpAlign || 'left'}
			sx={{
				...(props.tpSize ? {} : { fontSize: 'initial' }),
				...(props.centeredFlex
					? {
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							gap: '.5rem',
					  }
					: {}),
				...(props.lkHref || props.hoverStyles
					? props.sx && !props.boxWrapper
						? mixSxProps(props.sx, !!props.lkHref || props.hoverStyles)
						: hoverSxProps(!!props.lkHref || props.hoverStyles)
					: props.sx),
			}}
			onClick={(e: any) => (props.onClick !== undefined ? props.onClick(e) : {})}
		>
			{props.text}
			{props.children === undefined ? '' : Array.isArray(props.children) ? <>{props.children}</> : props.children}
		</Typography>
	);

	if (props.lkHref)
		component = (
			<Link role='link' href={props.lkHref} title={props.lkTitle} {...props.lkProps}>
				{component}
			</Link>
		);

	if (props.ttNode)
		component = props.ttOnClickMode ? (
			<ClickAwayListener
				onClickAway={() => setTooltipState(false)}
				disableReactTree
				mouseEvent='onMouseDown'
				touchEvent='onTouchStart'
			>
				<Box sx={{ width: props.boxWidth || 'fit-content' }}>
					<Tooltip
						role='tooltip'
						sx={{ width: props.boxWidth || 'fit-content' }}
						title={props.ttNode}
						placement={props.ttPlacement}
						followCursor={false}
						TransitionComponent={Zoom}
						PopperProps={{
							disablePortal: true,
							sx: {
								'> div': {
									backgroundColor: typeof props.ttNode !== 'string' ? 'transparent' : undefined,
									maxWidth: '98vw',
								},
							},
						}}
						open={tooltipState}
						onClose={() => setTooltipState(false)}
						disableFocusListener
						disableHoverListener
						disableTouchListener
					>
						{props.lkHref && !props.boxWrapper ? (
							<span onClick={() => setTooltipState(prev => !prev)}>{component}</span>
						) : (
							<div onClick={() => setTooltipState(prev => !prev)}>{component}</div>
						)}
					</Tooltip>
				</Box>
			</ClickAwayListener>
		) : (
			<Tooltip
				role='tooltip'
				arrow={props.ttArrow}
				title={props.ttNode}
				placement={props.ttPlacement}
				followCursor={props.ttFollow === undefined ? true : props.ttFollow}
				PopperProps={{
					sx: { '> div': { maxWidth: 'min(95vw, 450px)' } },
				}}
			>
				{props.lkHref && !props.boxWrapper ? <span>{component}</span> : component}
			</Tooltip>
		);

	return props.boxWrapper ? (
		<Box
			{...props.ariaProps}
			width={props.boxWidth || '100%'}
			sx={{
				...props.sx,
				'> a > div': {
					display: props.boxVerticalAlign ? 'flex' : '',
					alignItems: props.boxVerticalAlign || '',
					gap: props.boxVerticalAlign ? '.25rem' : '',
				},
			}}
			display={props.boxAlign ? 'flex' : ''}
			justifyContent={props.boxAlign || 'unset'}
			alignItems={props.boxVerticalAlign || 'unset'}
			alignContent={props.boxAlign || 'unset'}
		>
			{component}
		</Box>
	) : (
		component
	);
};

export interface OnyxTypographyI {
	id?: string;
	ariaProps?: AriaAttributes;
	component?: ElementType<any>;
	children?: ReactNode | ReactNode[];
	text?: string | number;
	sx?: SxProps<Theme>;
	onClick?: (() => void) | ((e: any) => void);
	centeredFlex?: boolean;
	hoverStyles?: boolean;
	lkHref?: string;
	lkTitle?: string;
	lkProps?: {
		target?: HTMLAttributeAnchorTarget;
		rel?: 'norefferer' | string;
	};
	tpVariant?:
		| 'button'
		| 'caption'
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6'
		| 'inherit'
		| 'subtitle1'
		| 'subtitle2'
		| 'body1'
		| 'body2'
		| 'overline';
	tpSize?: string;
	tpWeight?: 'normal' | 'bold' | 'initial' | 'inherit' | 'unset';
	tpAlign?: 'right' | 'left' | 'inherit' | 'center' | 'justify';
	//tpColor -> can't find valid ColorsType from MUI|React cores -> string :\
	tpColor?: 'primary' | 'secondary' | 'warning' | 'error' | 'inherit' | 'initial' | string;
	boxWrapper?: boolean;
	boxWidth?: string;
	boxAlign?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
	boxVerticalAlign?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
	ttArrow?: boolean;
	ttNode?: ReactNode;
	ttFollow?: boolean;
	ttOnClickMode?: boolean;
	ttPlacement?:
		| 'bottom'
		| 'left'
		| 'right'
		| 'top'
		| 'bottom-end'
		| 'bottom-start'
		| 'left-end'
		| 'left-start'
		| 'right-end'
		| 'right-start'
		| 'top-end'
		| 'top-start';
}

function hoverSxProps(colorChange: boolean = false) {
	return colorChange
		? {
				cursor: 'pointer',
				transition: 'all .2s ease-out',
				'&:hover': {
					color: '#416df1',
				},
		  }
		: {
				cursor: 'pointer',
				transition: 'all .2s ease-out',
		  };
}

function mixSxProps(sx: SxProps<Theme>, colorChange: boolean = false) {
	return { ...hoverSxProps(colorChange), ...sx };
}
