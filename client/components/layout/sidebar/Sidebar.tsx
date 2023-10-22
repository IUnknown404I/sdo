import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SupportOutlinedIcon from '@mui/icons-material/SupportOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { Badge, Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useRouter } from 'next/router';
import React, { MouseEventHandler } from 'react';
import { createPortal } from 'react-dom';
import { rtkApi } from '../../../redux/api';
import OnyxLink from '../../basics/OnyxLink';
import MessengerSidebar from '../../messenger/sidebarComponents/MessengerSidebar';

export const Sidebar = () => {
	const router = useRouter();
	const [messangerState, setMessangerState] = React.useState<boolean>(false);

	const { data: friendsObject } = rtkApi.useFriendsQuery('');

	return (
		<>
			<nav>
				<Box
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
					<List sx={{ marginBottom: '20px' }}>
						<ListItem disablePadding>
							<OnyxLink blockElement style={{ width: '100%' }} href={'/'} fullwidth title='Перейти'>
								<SidebarBadgeButton
									text='Личный кабинет'
									selected={router.asPath.includes('/account/') || !router.asPath}
									listItemIcon={<PermIdentityOutlinedIcon />}
								/>
							</OnyxLink>
						</ListItem>
						<ListItem disablePadding>
							<OnyxLink blockElement style={{ width: '100%' }} href={'/events'} fullwidth title='Перейти'>
								<SidebarBadgeButton
									color='error'
									text='События'
									selected={router.asPath === '/events'}
									listItemIcon={<CalendarMonthOutlinedIcon />}
									badgeContent={2}
								/>
							</OnyxLink>
						</ListItem>
						<ListItem disablePadding>
							<SidebarBadgeButton
								color='info'
								text='Сообщения'
								badgeContent={
									0 + (friendsObject?.pending.length || 0) + (friendsObject?.requested.length || 0)
								}
								selected={
									router.asPath.includes('/communication') ||
									router.asPath.includes('/communication/hub')
								}
								listItemIcon={<TextsmsOutlinedIcon />}
								onClick={() => setMessangerState(true)}
							/>
						</ListItem>
					</List>
					<Divider sx={{ margin: 'auto', marginY: '10px', width: '80%' }} />

					<List>
						<SideListItem
							href='/users'
							text='Пользователи'
							selected={router.asPath === '/users'}
							icon={<ManageAccountsOutlinedIcon />}
						/>
						<SideListItem
							href='/constructor'
							text='Конструктор'
							selected={router.asPath === '/constructor'}
							icon={<DashboardCustomizeOutlinedIcon />}
						/>
						<SideListItem
							href='/feedback'
							text='Отчеты'
							selected={router.asPath === '/feedback'}
							icon={<BarChartOutlinedIcon />}
						/>
						<SideListItem
							href='/disk'
							text='Хранилище'
							selected={router.asPath === '/disk'}
							icon={<CloudDoneOutlinedIcon />}
						/>
						<SideListItem
							href='/config'
							text='Настройки'
							selected={router.asPath === '/config'}
							icon={<TuneOutlinedIcon />}
						/>
					</List>
					<Divider sx={{ margin: 'auto', marginY: '10px', width: '80%' }} />

					<List>
						<SideListItem
							href='/courses'
							text='Курсы'
							selected={router.asPath === '/courses'}
							icon={<SchoolOutlinedIcon />}
						/>
						<SideListItem
							href='/help'
							text='Справка'
							selected={router.asPath === '/help'}
							icon={<SupportOutlinedIcon />}
						/>
						<SideListItem
							href='/support'
							text='Помощь'
							selected={router.asPath === '/support'}
							icon={<HeadsetMicOutlinedIcon />}
						/>
					</List>
				</Box>
			</nav>

			{createPortal(
				<MessengerSidebar detachedDrawer controlled={{ state: messangerState, setState: setMessangerState }} />,
				document.body,
			)}
		</>
	);
};

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
				// TODO: MouseEventHandler<HTMLDivElement> type check and refactor
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

function SideListItem(props: { href: string; text: string; selected: boolean; icon: JSX.Element }) {
	return (
		<ListItem disablePadding>
			<OnyxLink blockElement style={{ width: '100%' }} href={props.href} fullwidth title='Перейти'>
				<ListItemButton selected={props.selected} sx={{ borderRadius: '30px', marginBottom: '5px' }}>
					<ListItemIcon>{props.icon}</ListItemIcon>
					<ListItemText primary={props.text} />
				</ListItemButton>
			</OnyxLink>
		</ListItem>
	);
}
