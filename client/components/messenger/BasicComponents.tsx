import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { Avatar, Badge, Box, Divider, OutlinedInput, Slide, Stack, SxProps, Tab, Theme } from '@mui/material';
import React from 'react';
import useRafRepaint from '../../hooks/useRafRepaint';
import { ChatMessageI } from '../../redux/endpoints/chatEnd';
import { OnyxTypography } from '../basics/OnyxTypography';
import ContactsModal from '../pages/communication/hub/personal/ContactsModal';
import FriendsModal from '../pages/communication/hub/personal/FriendsModal';
import { avatarUrlParse } from '../utils/bgAvatars/BgAvatars';
import { relativeDateFormatter, stringAvatar } from './chats-utility';
import { ChatNamingChip } from './sidebarComponents/DialogDrawer';
import { DialogType } from './sidebarComponents/MessengerSidebar';

export function MessengerSidebarTab(payload: {
	tab: number;
	tabIndex: number;
	label: string;
	iconPosition?: 'bottom' | 'top' | 'start' | 'end';
	icon: JSX.Element;
	sx?: SxProps;
	badgeProps?: Array<{
		badgeContent: React.ReactNode;
		badgeColor?: 'default' | 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning';
		badgeSx?: SxProps;
	}>;
}) {
	const sxProps: SxProps = {
		...payload.sx,
		position: 'relative',
		transition: 'all .3s ease-in',
		backgroundColor: theme =>
			payload.tabIndex === payload.tab
				? (theme as Theme).palette.mode === 'light'
					? (theme as Theme).palette.grey[300] + ' !important'
					: '#202e3c !important'
				: (theme as Theme).palette.mode === 'light'
				? ''
				: '#162534 !important',
	};

	return (
		<Tab
			{...payload}
			iconPosition={payload.iconPosition || 'top'}
			icon={payload.icon || <AllInclusiveIcon />}
			sx={sxProps}
			label={
				<>
					{payload.label}
					{payload.badgeProps !== undefined &&
						!!payload.badgeProps.length &&
						payload.badgeProps.map((badgeOptions, index) => (
							<Badge
								key={index}
								badgeContent={badgeOptions.badgeContent}
								color={badgeOptions.badgeColor || 'success'}
								sx={{
									position: 'absolute',
									top: `${(index + 1) * 15 * (index === 0 ? 1 : 1.25)}px`,
									right: `15px`,
									transition: 'all .35s linear',
									opacity: payload.tab === payload.tabIndex ? '1' : '.5',
									...badgeOptions.badgeSx,
								}}
							/>
						))}
				</>
			}
		/>
	);
}

export function MessengerSearchBox(payload: {
	value: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	contacts?: boolean;
}) {
	const SLIDE_TIMEOUT = 450;
	const [searchfieldTouched, setSearchfieldTouch] = React.useState<boolean>(false);

	return (
		<>
			<Stack
				width='100%'
				flexDirection='column'
				justifyContent='center'
				alignItems='center'
				gap={0}
				sx={{
					transition: 'all .25s ease-in',
					paddingInline: searchfieldTouched ? '.25rem' : '1rem',
					marginTop: '-.25rem',
				}}
				height={payload.contacts ? '125px' : '45px'}
			>
				<OutlinedInput
					fullWidth
					size='small'
					type='text'
					id='chats-search'
					error={undefined}
					disabled={undefined}
					value={payload.value}
					placeholder='Поиск чатов'
					onChange={e => payload.setValue(e.target.value)}
					onFocus={_ => setSearchfieldTouch(true)}
					onBlur={_ => setSearchfieldTouch(false)}
					sx={{
						fontSize: '.85rem',
						border: theme => `1px solid ${theme.palette.primary.main}`,
						backgroundColor: theme => (theme.palette.mode === 'light' ? 'white' : ''),
						fieldset: { border: 'unset !important' },
					}}
				/>

				<Slide
					in={payload.contacts}
					direction='left'
					timeout={SLIDE_TIMEOUT}
					easing={{ enter: 'ease-out', exit: 'ease-in' }}
				>
					<Box
						width='100%'
						sx={{
							transition: 'all .5s ease-in-out',
							marginTop: !payload.contacts ? '0' : '.5rem',
							height: !payload.contacts ? '0' : '45px',
						}}
					>
						<ContactsModal
							buttonProps={{
								size: 'medium',
								fullwidth: true,
								variant: 'contained',
								sx: { textTransform: 'unset', fontSize: '.9rem' },
							}}
						/>
					</Box>
				</Slide>

				<Slide
					direction='right'
					in={payload.contacts}
					timeout={SLIDE_TIMEOUT}
					easing={{ enter: 'ease-in', exit: 'ease-out' }}
				>
					<Box
						width='100%'
						sx={{
							transition: 'all .5s ease-in-out',
							marginTop: !payload.contacts ? '0' : '.5rem',
							height: !payload.contacts ? '0' : '45px',
						}}
					>
						<FriendsModal
							buttonProps={{
								size: 'medium',
								fullwidth: true,
								variant: 'outlined',
								sx: { textTransform: 'unset', fontSize: '.9rem' },
							}}
						/>
					</Box>
				</Slide>
			</Stack>
			<Divider sx={{ width: '90%', margin: '-.25rem auto -1rem' }} />
		</>
	);
}

export function MessengerDialogBox(payload: {
	currentTab: number;
	avatarUrl?: string;
	dialogName?: string;
	lastMessage?: ChatMessageI;
	activeDialog?: DialogType | undefined;
	disabledChat?: boolean;
	onClick: Function;
}) {
	useRafRepaint(5e3);
	const activeTabDetect = (): boolean =>
		payload.activeDialog !== undefined &&
		payload.activeDialog.tab === payload.currentTab &&
		payload.activeDialog.name === payload.dialogName;
	const activeStyles: SxProps = {
		backgroundColor: theme =>
			activeTabDetect() ? 'rgba(0,135,255,.35)' : (theme as Theme).palette.mode === 'light' ? 'white' : '#162534',
	};

	return (
		<Stack
			component='section'
			gap={1}
			width='100%'
			direction='row'
			padding='.5rem'
			alignItems='center'
			sx={{
				cursor: 'pointer',
				borderRadius: '14px',
				transition: 'all .25s ease-in',
				...(activeTabDetect() ? activeStyles : {}),
				'&:hover': { ...activeStyles },
			}}
			onClick={() => (payload.onClick ? payload.onClick() : undefined)}
		>
			<MessengerAvatarElement name={payload.dialogName || 'Чат системы'} avatarUrl={payload.avatarUrl} />
			<Stack direction='column' justifyContent='flex-start' gap={0} width='100%' sx={{ gap: '.25rem' }}>
				<Stack direction='row' justifyContent='space-between' alignItems='center' gap={1}>
					<OnyxTypography tpWeight='bold'>{payload.dialogName || 'Чат системы'}</OnyxTypography>

					{payload.disabledChat && !payload.dialogName?.includes('до:') && (
						<ChatNamingChip color='warning' variant='outlined' label='только чтение' />
					)}
					{payload.disabledChat && payload.dialogName?.includes('до:') && (
						<ChatNamingChip color='warning' variant='outlined' label='архив чата' />
					)}
				</Stack>

				{payload.lastMessage !== undefined ? (
					<Stack direction='row' justifyContent='space-between' alignItems='center' gap={1}>
						<OnyxTypography
							component='pre'
							tpSize='.85rem'
							sx={{ width: '40ch', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
						>
							{payload.lastMessage.message}
						</OnyxTypography>
						<OnyxTypography
							tpColor='secondary'
							tpSize='.75rem'
							// sx={{ width: '12ch', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
							sx={{ textAlign: 'right' }}
						>
							{relativeDateFormatter(payload.lastMessage.timeSent)}
						</OnyxTypography>
					</Stack>
				) : (
					<OnyxTypography
						component='pre'
						tpSize='.85rem'
						tpColor='secondary'
						sx={{ width: '45ch', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
					>
						В чате ещё не было сообщений
					</OnyxTypography>
				)}
			</Stack>
		</Stack>
	);
}

export function MessengerAvatarElement(payload: {
	name: string;
	avatarUrl?: string;
	widthAvatar?: number;
	heightAvatar?: number;
	fontSize?: string;
}) {
	const avatarUrl = payload.avatarUrl ? avatarUrlParse(payload.avatarUrl) : '';
	return (
		<Box
			sx={{
				padding: '2px',
				borderRadius: '50%',
				backgroundColor: theme => theme.palette.primary.dark,
			}}
		>
			<Avatar
				src={avatarUrl}
				alt='chat avatar'
				{...stringAvatar(
					payload.name,
					true,
					typeof payload.widthAvatar === 'number' ? `${payload.widthAvatar}px` : undefined,
					typeof payload.heightAvatar === 'number' ? `${payload.heightAvatar}px` : undefined,
					payload.fontSize,
				)}
				onClick={() => {}}
			/>
		</Box>
	);
}
