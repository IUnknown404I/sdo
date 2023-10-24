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
import { Divider, List, ListItem } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { createPortal } from 'react-dom';
import { rtkApi } from '../../../redux/api';
import OnyxLink from '../../basics/OnyxLink';
import MessengerSidebar from '../../messenger/sidebarComponents/MessengerSidebar';
import { SideListItem, SidebarBadgeButton, SidebarNavContainer } from './SidebarElements';

export const Sidebar = () => {
	const router = useRouter();
	const [messangerState, setMessangerState] = React.useState<boolean>(false);

	const { data: friendsObject } = rtkApi.useFriendsQuery('');

	return (
		<SidebarNavContainer>
			<List sx={{ marginBottom: '20px' }}>
				<ListItem disablePadding>
					<OnyxLink blockElement style={{ width: '100%' }} href={'/'} fullwidth title='Перейти'>
						<SidebarBadgeButton
							text='Личный кабинет'
							selected={router.asPath.includes('/account/') || router.asPath === '/' || !router.asPath}
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
						badgeContent={0 + (friendsObject?.pending.length || 0) + (friendsObject?.requested.length || 0)}
						selected={
							router.asPath.includes('/communication') || router.asPath.includes('/communication/hub')
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

			{createPortal(
				<MessengerSidebar detachedDrawer controlled={{ state: messangerState, setState: setMessangerState }} />,
				document.body,
			)}
		</SidebarNavContainer>
	);
};
