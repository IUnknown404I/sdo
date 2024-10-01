import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import SchoolIcon from '@mui/icons-material/School';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SupportOutlinedIcon from '@mui/icons-material/SupportOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { Divider, List, ListItem } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { createPortal } from 'react-dom';
import { rtkApi } from '../../../redux/api';
import { useTypedSelector } from '../../../redux/hooks';
import { SystemRolesOptions, selectUser } from '../../../redux/slices/user';
import OnyxLink from '../../basics/OnyxLink';
import MessengerSidebar from '../../messenger/sidebarComponents/MessengerSidebar';
import { SideListItem, SidebarBadgeButton, SidebarNavContainer } from './SidebarElements';

export const Sidebar = () => {
	const router = useRouter();
	const userData = useTypedSelector(selectUser);

	const [messangerState, setMessangerState] = React.useState<boolean>(false);

	const { data: friendsObject } = rtkApi.useFriendsQuery('');

	return (
		<SidebarNavContainer>
			<List sx={{ marginBottom: '20px' }}>
				<ListItem disablePadding>
					<OnyxLink blockElement style={{ width: '100%' }} href='/' fullwidth title='Перейти'>
						<SidebarBadgeButton
							text='Личный кабинет'
							selected={router.asPath.includes('/account/') || router.asPath === '/' || !router.asPath}
							listItemIcon={<PermIdentityOutlinedIcon />}
						/>
					</OnyxLink>
				</ListItem>
				<ListItem disablePadding>
					<OnyxLink blockElement style={{ width: '100%' }} href='/events' fullwidth title='Перейти'>
						<SidebarBadgeButton
							color='error'
							text='События'
							selected={router.asPath === '/events'}
							listItemIcon={<CalendarMonthOutlinedIcon />}
							// badgeContent={2}
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

			{router.asPath.split('?')[0].startsWith('/courses/') &&
			router.asPath.split('?')[0].split('/').includes('courses') ? ( // COURSE LAYOUT RENDERS
				<List sx={{ marginTop: '1rem' }}>
					{!!router.query.cid && router.asPath.split(router.query.cid as string).length > 1 && (
						<SideListItem
							selected={router.asPath.split('/').includes('courses') && !router.query.addType}
							text='Программа'
							href={`/courses/${router.query.cid}`}
							icon={<SchoolIcon />}
						/>
					)}
					<SideListItem
						selected={
							router.query.addType === 'files' &&
							router.asPath.split('?')[0].split('/').includes('additionals')
						}
						href={`/courses/${router.query.cid}/additionals?addType=files`}
						text='Файлы'
						icon={<ManageAccountsOutlinedIcon />}
					/>
					<SideListItem
						selected={
							router.query.addType === 'materials' &&
							router.asPath.split('?')[0].split('/').includes('additionals')
						}
						href={`/courses/${router.query.cid}/additionals?addType=materials`}
						text='Материалы'
						icon={<BarChartOutlinedIcon />}
					/>
					<SideListItem
						selected={
							router.query.addType === 'records' &&
							router.asPath.split('?')[0].split('/').includes('additionals')
						}
						href={`/courses/${router.query.cid}/additionals?addType=records`}
						text='Записи вебинаров'
						icon={<CloudDoneOutlinedIcon />}
					/>
				</List>
			) : SystemRolesOptions[userData._systemRole].accessLevel > 0 ? (
				// MAIN LAYOUT RENDERS
				<List>
					{SystemRolesOptions[userData._systemRole].accessLevel > 0 && userData._systemRole !== 'content' && (
						<SideListItem
							disabled
							href='/feedback'
							text='Отчеты'
							selected={router.asPath === '/feedback'}
							icon={<ContentPasteSearchOutlinedIcon />}
						/>
					)}
					{SystemRolesOptions[userData._systemRole].accessLevel > 1 && (
						<SideListItem
							href='/storage'
							text='Хранилище'
							selected={router.asPath === '/storage' || router.asPath.includes('/storage')}
							icon={<CloudDoneOutlinedIcon />}
						/>
					)}
					{SystemRolesOptions[userData._systemRole].accessLevel > 3 && (
						<SideListItem
							href='/users'
							text='Пользователи'
							selected={router.asPath === '/users' || router.asPath.includes('/users')}
							icon={<ManageAccountsOutlinedIcon />}
						/>
					)}
					{SystemRolesOptions[userData._systemRole].accessLevel > 0 && (
						<SideListItem
							href='/testing-module'
							text='Тесты и вопросы'
							selected={router.asPath === '/testing-module' || router.asPath.includes('/testing-module')}
							icon={<DashboardCustomizeOutlinedIcon />}
						/>
					)}
					{SystemRolesOptions[userData._systemRole].accessLevel >= 4 && (
						<SideListItem
							href='/admin-courses'
							text='Управление курсами'
							selected={router.asPath === '/admin-courses' || router.asPath.includes('/admin-courses')}
							icon={<LocalLibraryOutlinedIcon />}
						/>
					)}
					{SystemRolesOptions[userData._systemRole].accessLevel > 4 && (
						<SideListItem
							href='/config'
							text='Настройки системы'
							selected={router.asPath === '/config' || router.asPath.includes('/config')}
							icon={<TuneOutlinedIcon />}
						/>
					)}
				</List>
			) : (
				<></>
			)}
			{SystemRolesOptions[userData._systemRole].accessLevel > 0 && (
				<Divider sx={{ margin: 'auto', marginY: '10px', width: '80%' }} />
			)}

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
