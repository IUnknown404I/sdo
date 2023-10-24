import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import {
	Backdrop,
	Box,
	SpeedDial,
	SpeedDialAction,
	SpeedDialIcon,
	SxProps,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import React, { ComponentProps, ReactNode } from 'react';
import OnyxLink from './OnyxLink';

const DEFAULT_ITEMS: OnyxSpeedDialAction[] = [
	{
		icon: <AutoFixHighIcon />,
		name: 'Режим редактирования',
	},
	{
		icon: <SettingsIcon />,
		name: 'Настройки раздела',
	},
	{
		icon: <SecurityIcon />,
		name: 'Ограничения раздела',
	},
	{
		icon: <SaveIcon />,
		name: 'Сохранить изменения',
	},
	{
		icon: <PrintIcon />,
		name: 'На печать',
	},
];

const SMALL_SIZE = 22;
const NORMAL_SIZE = 56;

interface OnyxSpeedDialI extends ComponentProps<typeof SpeedDial> {
	icon?: ReactNode;
	openIcon?: ReactNode;
	items?: Array<OnyxSpeedDialAction>;
	size?: 'normal' | 'small';
	disableOpenIcon?: boolean;
	disableBackdrop?: boolean;
	blockElement?: boolean;
	placement?: 'top' | 'bottom';
	itemsPlacement?:
		| 'top'
		| 'bottom'
		| 'left'
		| 'right'
		| 'bottom-end'
		| 'bottom-start'
		| 'left-end'
		| 'left-start'
		| 'right-end'
		| 'right-start'
		| 'top-end'
		| 'top-start';
	containerSx?: SxProps;
}

interface OnyxSpeedDialAction extends ComponentProps<typeof SpeedDialAction> {
	name: string;
	rel?: string;
	href?: string;
	target?: '_blank' | '_parent' | '_top' | string;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * @IUnknown404I Corporate customized element for displaying edite options of the current element \ page.
 * @default 'Doesnt display both on mobile screens and on print-pages!'
 * @param props as interface that extends props of MUI SpeedDial and Object:
 * - items: required list of the inner-items, the type extends SpeedDialAction element and optional can be passed href\target\rel attributes for the OnyxLink wrapper enabling;
 * - disableBackdrop: optional boolean for hiding the Backdrop-component;
 * - openIcon: optional ReactNode for overriding existing icon on &:active OnyxSpeedDial state.
 * @returns Fixed corporate-styled element with items.
 */
const OnyxSpeedDial = (props: OnyxSpeedDialI) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.up('md'));

	const [state, setState] = React.useState(false);

	const handleOpen = () => setState(true);
	const handleClose = () => setState(false);

	return (
		<Box
			sx={{
				position: !!props.blockElement ? 'static' : 'fixed',
				display: fullScreen ? '' : 'none',
				top: props.placement === 'top' ? 0 : 'unset',
				bottom: props.placement === 'top' ? 'uset' : 0,
				right: 0,
				flexGrow: 1,
				zIndex: 1,
				...props.containerSx,
				'@media print': { display: 'none !important' },
			}}
		>
			{!props.disableBackdrop && <Backdrop open={state} />}
			<SpeedDial
				open={state}
				direction={props.placement === 'top' ? 'down' : 'up'}
				icon={
					props.icon || (
						<SpeedDialIcon
							openIcon={!!props.disableOpenIcon ? undefined : props.openIcon || <EditIcon />}
						/>
					)
				}
				{...props}
				onOpen={handleOpen}
				onClose={handleClose}
				sx={{
					position: 'absolute',
					top: props.placement === 'top' ? (props.size === 'small' ? 0 : 16) : 'unset',
					bottom: props.placement === 'top' ? 'unset' : props.size === 'small' ? 4 : 16,
					right: props.size === 'small' ? 0 : 16,
					'> button': {
						minHeight: props.size === 'small' ? 'unset' : undefined,
						width: props.size === 'small' ? `${SMALL_SIZE}px` : `${NORMAL_SIZE}px`,
						height: props.size === 'small' ? `${SMALL_SIZE}px` : `${NORMAL_SIZE}px`,
						'span > svg, > svg': { fontSize: props.size === 'small' ? '1rem' : undefined },
					},
					'> div': {
						paddingTop: props.size === 'small' ? `${`${SMALL_SIZE + 6}px`} !important` : undefined,
					},
					...props.sx,
				}}
			>
				{(!!props.items && props.items.length > 0 ? props.items : DEFAULT_ITEMS).toReversed().map(item => (
					<OnyxSpeedDialAction
						{...item}
						tooltipOpen
						key={item.name}
						icon={item.icon}
						tooltipTitle={item.name}
						tooltipPlacement={props.itemsPlacement}
						onClick={e => {
							handleClose();
							if (!!item.onClick) item.onClick(e);
						}}
						sx={{
							'> span': {
								width: '150px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								textAlign: 'center',
								lineHeight: 1.25,
								border: '1px solid #006fba',
								fontSize: props.size === 'small' ? '.85rem' : '1rem',
								minHeight: props.size === 'small' ? 'unset' : '40px',
								color: theme => (theme.palette.mode === 'light' ? 'black' : 'white'),
							},
							'> button': {
								border: '1px solid #006fba',
								minHeight: props.size === 'small' ? 'unset' : undefined,
								width: props.size === 'small' ? `${SMALL_SIZE}px` : '48px',
								height: props.size === 'small' ? `${SMALL_SIZE}px` : '48px',
								color: theme => (theme.palette.mode === 'light' ? '#006fba' : 'cyan'),
								svg: { fontSize: props.size === 'small' ? '1rem !important' : undefined },
							},
						}}
					/>
				))}
			</SpeedDial>
		</Box>
	);
};

function OnyxSpeedDialAction(props: OnyxSpeedDialAction) {
	const Action = (
		<SpeedDialAction
			{...props}
			tooltipOpen
			key={props.name}
			icon={props.icon}
			tooltipTitle={props.name}
			onClick={props.onClick}
		/>
	);

	return !!props.href ? (
		<OnyxLink href={props.href} target={props.target} rel={props.rel}>
			{Action}
		</OnyxLink>
	) : (
		Action
	);
}

export default OnyxSpeedDial;
