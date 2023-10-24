import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import MarkUnreadChatAltOutlinedIcon from '@mui/icons-material/MarkUnreadChatAltOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Divider, Drawer, IconButton, SxProps, Tooltip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AccountMenu, Footer, LogoGMI, NotificationMenu, Search, Sidebar, SwitchTheme } from '../..';
import MessengerSidebar from '../../messenger/sidebarComponents/MessengerSidebar';

interface HeaderI {
	publicMode?: boolean;
	chatIcon?: boolean;
	disableRoundMark?: boolean;
	sx?: SxProps;
}

/**
 * @IUnknown404I Header complex component, including basic and mobile versions.
 * @param props as object:
 * - sx?: as standart MUI SxProps object;
 * - publicMode?: boolean = is the current Page only for authorized users -> false; if for public use -> true;
 * - chatIcon?: boolean = activate the izolated chat instance within the header or not;
 * - disableRoundMark?: boolean = should or not hide the :before and :after boxes in the left-upper corner of the <main> component which is responsible for the roundless of the box.
 * @returns an ReactNode element of the <header> element for the App.
 */
export const Header = (props: HeaderI) => {
	const router = useRouter();
	const [sidebarDrawer, setSidebarDrawer] = useState<boolean>(false);
	const [messangerState, setMessangerState] = React.useState<boolean>(false);

	return (
		<Stack
			direction='row'
			justifyContent='space-between'
			alignItems='center'
			component={'header'}
			sx={{
				width: '100%',
				height: '100px',
				position: 'absolute',
				top: 0,
				bgcolor: 'background.default',
				color: 'text.primary',
				'&:before': props.disableRoundMark
					? {}
					: {
							content: { md: 'unset', lg: '""' },
							position: 'absolute',
							bottom: '-10px',
							left: '0',
							backgroundColor: theme => (theme.palette.mode === 'light' ? 'white' : '#0a1929'),
							width: '10px',
							height: '10px',
					  },
				'&:after': props.disableRoundMark
					? {}
					: {
							content: { md: 'unset', lg: '""' },
							position: 'absolute',
							bottom: '-10px',
							left: '0',
							backgroundColor: theme => (theme.palette.mode === 'light' ? '#eceff1' : '#102a43'),
							width: '10px',
							height: '10px',
							borderTopLeftRadius: '20px',
					  },
				...props.sx,
			}}
		>
			<Box
				sx={{
					display: props.publicMode
						? { xs: 'flex' }
						: {
								xs: 'flex',
								md: 'flex',
								lg: 'none',
						  },
					alignItems: 'center',
					marginLeft: '30px',
				}}
			>
				<LogoGMI />
			</Box>

			<Box
				sx={{
					marginLeft: '10px',
					display: props.publicMode
						? { xs: 'none' }
						: {
								xs: 'none',
								md: 'none',
								lg: 'flex',
						  },
				}}
			>
				<Typography component='h1' variant='body1' fontWeight='bold' paddingLeft='.5rem'>
					{getPageTitle().toUpperCase()}
				</Typography>
			</Box>

			{props.publicMode ? (
				<OuterStack />
			) : (
				<InnerStack
					chatIcon={props.chatIcon}
					chatIconClick={props.chatIcon ? () => setMessangerState(prev => !prev) : undefined}
					drawerState={sidebarDrawer}
					toggleDrawer={toggleDrawer}
				/>
			)}

			{props.chatIcon &&
				createPortal(
					<MessengerSidebar
						detachedDrawer
						sideOverride='right'
						controlled={{ state: messangerState, setState: setMessangerState }}
					/>,
					document.body,
				)}
		</Stack>
	);

	function toggleDrawer(event: any) {
		if (
			event.type === 'keydown' &&
			((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
		) {
			return;
		}
		setSidebarDrawer(sidebarDrawer => !sidebarDrawer);
	}

	function getPageTitle() {
		const pathString = router.asPath;
		return pathString.includes('/account/') || pathString === '/'
			? 'Личный кабинет'
			: pathString.includes('/events')
			? 'События'
			: pathString.includes('/communication')
			? 'Сообщения'
			: pathString.includes('/courses/')
			? 'Образовательная программа'
			: pathString.includes('/courses')
			? 'Список образовательных программ'
			: 'Система дистанционного образования';
	}
};

function OuterStack() {
	return (
		<Stack
			sx={{
				marginRight: '30px',
				marginLeft: {
					md: '0',
					lg: 'auto',
				},
			}}
			direction='row'
			alignItems='center'
		>
			<Stack
				spacing={2}
				direction='row'
				alignItems='center'
				justifyContent='center'
				sx={{
					display: {
						xs: 'flex',
					},
				}}
			>
				<SwitchTheme />
			</Stack>
		</Stack>
	);
}

function InnerStack(payload: {
	chatIcon?: boolean;
	chatIconClick?: Function;
	toggleDrawer: (e: any) => void;
	drawerState: boolean;
}) {
	return (
		<Stack
			sx={{
				marginRight: '30px',
				marginLeft: {
					md: '0',
					lg: 'auto',
				},
			}}
			direction='row'
			alignItems='center'
		>
			<Stack
				spacing={2}
				direction='row'
				alignItems='center'
				justifyContent='center'
				sx={{
					display: {
						xs: 'none',
						md: 'none',
						lg: 'flex',
						xl: 'flex',
					},
				}}
			>
				{payload.chatIcon && (
					<Box>
						<Tooltip title='Открыть мессенджер'>
							<IconButton
								sx={{ color: 'blackText.main' }}
								aria-label='search'
								onClick={
									!!payload.chatIconClick ? () => (payload.chatIconClick as Function)() : () => {}
								}
							>
								<MarkUnreadChatAltOutlinedIcon
									sx={{ fontSize: '1.5rem', transform: 'rotateY(180deg)' }}
								/>
							</IconButton>
						</Tooltip>
					</Box>
				)}
				<Search />
				<NotificationMenu />
				<SwitchTheme />
			</Stack>

			<Divider
				flexItem
				sx={{
					padding: '15px',
					display: {
						xs: 'none',
						md: 'none',
						lg: 'block',
						xl: 'block',
					},
				}}
				orientation='vertical'
			/>

			<Box
				sx={{
					marginX: '10px',
					display: {
						xs: 'block',
						md: 'block',
						lg: 'none',
						xl: 'none',
					},
				}}
			>
				<IconButton sx={{ color: 'blackText.main' }} onClick={event => payload.toggleDrawer(event)}>
					<MenuOutlinedIcon />
				</IconButton>

				<Drawer
					keepMounted
					variant='temporary'
					anchor='right'
					open={payload.drawerState}
					onClose={event => payload.toggleDrawer(event)}
				>
					<Stack
						sx={{
							marginTop: '30px',
							paddingX: '10px',
						}}
						direction='row'
						justifyContent='space-around'
					>
						<Search />
						<NotificationMenu />
						<SwitchTheme />

						<Divider orientation='vertical' />
						<IconButton sx={{ color: 'blackText.main' }} onClick={event => payload.toggleDrawer(event)}>
							<CloseOutlinedIcon />
						</IconButton>
					</Stack>

					<Divider sx={{ marginY: '20px' }} />
					<Box
						onClick={event => payload.toggleDrawer(event)}
						onKeyDown={event => payload.toggleDrawer(event)}
					>
						<Stack
							sx={{
								padding: '20px 20px',
								width: 260,
								height: '100%',
							}}
							direction='column'
							justifyContent='space-around'
						>
							<Stack sx={{ marginBottom: 'auto' }}>
								<Sidebar />
							</Stack>
							<Stack justifyContent='center'>
								<Footer />
							</Stack>
						</Stack>
					</Box>
				</Drawer>
			</Box>

			<AccountMenu />
		</Stack>
	);
}
