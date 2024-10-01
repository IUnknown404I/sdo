import { Badge, Box, ListItem, ListItemButton, ListItemIcon, ListItemText, SxProps } from '@mui/material';
import { useRouter } from 'next/router';
import { MouseEventHandler, ReactNode } from 'react';
import OnyxLink from '../../basics/OnyxLink';

export function SidebarNavContainer(props: { children?: string | ReactNode | ReactNode[] }) {
	return (
		<Box
			component='nav'
			sx={{
				padding: {
					md: '0',
					lg: '10px',
					xl: '20px',
				},
				paddingY: {
					md: '0',
					lg: '10px',
					xl: '15px',
				},
			}}
		>
			{props.children}
		</Box>
	);
}

export function SidebarBadgeButton(props: {
	text: string;
	listItemIcon: JSX.Element;
	selected?: boolean;
	badgeContent?: number;
	color?: 'error' | 'default' | 'primary' | 'info' | 'secondary' | 'success' | 'warning';
	onClick?: (e: MouseEventHandler<HTMLDivElement>) => void;
}) {
	const router = useRouter();
	return (
		<ListItemButton
			selected={props.selected !== undefined ? props.selected : router.asPath === '/' ? true : false}
			sx={{ borderRadius: '30px', marginBottom: '5px', width: '100%' }}
			onClick={e =>
				props.onClick != null ? props.onClick(e as unknown as MouseEventHandler<HTMLDivElement>) : undefined
			}
		>
			<ListItemIcon
				sx={{
					'> svg': {
						display: {
							xs: 'none',
							md: 'none',
							lg: 'none',
							xl: 'block',
						},
					},
				}}
			>
				<Badge
					component='div'
					sx={{
						display: {
							xs: 'block',
							md: 'block',
							lg: 'block',
							xl: 'none',
						},
					}}
					badgeContent={props.badgeContent !== undefined ? props.badgeContent : 0}
					color={props.color !== undefined ? props.color : 'info'}
				>
					{props.listItemIcon}
				</Badge>
				{props.listItemIcon}
			</ListItemIcon>

			<ListItemText primary={props.text} />
			<Badge
				component='div'
				sx={{
					display: {
						xs: 'none',
						md: 'none',
						lg: 'none',
						xl: 'block',
					},
				}}
				badgeContent={props.badgeContent !== undefined ? props.badgeContent : 0}
				color={props.color !== undefined ? props.color : 'info'}
			/>
		</ListItemButton>
	);
}

export function SideListItem(props: {
	href?: string;
	text: string;
	icon: JSX.Element;
	selected?: boolean;
	disabled?: boolean;
	onClick?: Function;
	sx?: SxProps;
}) {
	const ItemButtonElement = (
		<ListItemButton
			disabled={props.disabled}
			selected={props.selected}
			onClick={!!props.onClick ? () => (props.onClick as Function)() : undefined}
			sx={{
				borderRadius: '30px',
				marginBottom: '5px',
				cursor: props.disabled ? 'not-allowed' : 'pointer',
				...props.sx,
			}}
		>
			<ListItemIcon sx={{ minWidth: { xs: '35px', xl: '56px' } }}>{props.icon}</ListItemIcon>
			<ListItemText primary={props.text} />
		</ListItemButton>
	);

	return (
		<ListItem disablePadding sx={{ cursor: props.disabled ? 'not-allowed' : undefined }}>
			{!!props.href && !props.disabled ? (
				<OnyxLink blockElement style={{ width: '100%' }} href={props.href} fullwidth title='Перейти'>
					{ItemButtonElement}
				</OnyxLink>
			) : (
				ItemButtonElement
			)}
		</ListItem>
	);
}
