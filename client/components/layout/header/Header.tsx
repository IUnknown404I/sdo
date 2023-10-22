import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Divider, Drawer, IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AccountMenu, Footer, LogoGMI, NotificationMenu, Search, Sidebar, SwitchTheme } from '../..';

export const Header = (props: { publicMode?: boolean }) => {
	const router = useRouter();
	const [sidebarDrawer, setSidebarDrawer] = useState<boolean>(false);

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
				zIndex: 100,
				bgcolor: 'background.default',
				color: 'text.primary',
				'&:before': {
					content: { md: 'unset', lg: '""' },
					position: 'absolute',
					bottom: '-10px',
					left: '0',
					backgroundColor: theme => (theme.palette.mode === 'light' ? 'white' : '#0a1929'),
					width: '10px',
					height: '10px',
				},
				'&:after': {
					content: { md: 'unset', lg: '""' },
					position: 'absolute',
					bottom: '-10px',
					left: '0',
					backgroundColor: theme => (theme.palette.mode === 'light' ? '#eceff1' : '#102a43'),
					width: '10px',
					height: '10px',
					borderTopLeftRadius: '20px',
				},
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

			{props.publicMode ? <OuterStack /> : <InnerStack drawerState={sidebarDrawer} toggleDrawer={toggleDrawer} />}
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

function InnerStack(payload: { toggleDrawer: (e: any) => void; drawerState: boolean }) {
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
