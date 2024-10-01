import { SxProps, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { NextRouter, useRouter } from 'next/router';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { LogoGMI } from '../..';
import { rtkApi } from '../../../redux/api';
import MessengerSidebar from '../../messenger/sidebarComponents/MessengerSidebar';
import HeaderInnerStack from './HeaderInnerStack';
import HeaderOuterStack from './HeaderOuterStack';

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
	const { data: titleCopyrightVersion } = rtkApi.useSystemTitleCopyrightQuery();

	const [sidebarDrawer, setSidebarDrawer] = useState<boolean>(false);
	const [messangerState, setMessangerState] = React.useState<boolean>(false);

	return (
		<Stack
			direction='row'
			justifyContent='space-between'
			alignItems='center'
			component='header'
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
					{getPageHeaderTitle(router) === 'default'
						? (titleCopyrightVersion?.system_title ?? 'Система дистанционного образования').toUpperCase()
						: getPageHeaderTitle(router).toUpperCase()}
				</Typography>
			</Box>

			{props.publicMode ? (
				<HeaderOuterStack />
			) : (
				<HeaderInnerStack
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
};

export function getPageHeaderTitle(router: NextRouter) {
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
		: 'default';
}
