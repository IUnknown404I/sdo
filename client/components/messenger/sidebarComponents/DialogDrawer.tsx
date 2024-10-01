import SettingsIcon from '@mui/icons-material/Settings';
import StartOutlinedIcon from '@mui/icons-material/StartOutlined';
import { Chip, Divider, Stack, SwipeableDrawer, SxProps, useMediaQuery } from '@mui/material';
import React, { ComponentProps } from 'react';
import { rtkApi } from '../../../redux/api';
import { ChatI } from '../../../redux/endpoints/chatEnd';
import { useTypedSelector } from '../../../redux/hooks';
import { SystemRolesOptions } from '../../../redux/slices/user';
import { OnyxTypography } from '../../basics/OnyxTypography';
import { ChatContainer } from '../chatContainer/ChatContainer';
import { parseChatName, parseChatUsername } from '../chatContainer/ChatContainerComponent';
import ChatSettingsModal from './ChatSettingsModal';

const SIDEBAR_FULL_WIDTH = '650px';
const MESSENGER_SIDEBAR_WIDTH = '450px';
export const TOP_SPACING = '72px';

const INSETS_PANEL = (side: 'left' | 'right'): SxProps => ({
	top: TOP_SPACING,
	...getSideProps(side),
	height: `calc(100vh - ${TOP_SPACING})`,
	zIndex: { md: '1201', lg: '1199' },
	width: `min(100vw, ${SIDEBAR_FULL_WIDTH})`,
	transition: 'all .35s ease-in',
	'@media screen and (max-width: 1200px)': {
		width: 'min(100vw, 450px)',
	},
});

interface DialogDrawerProps {
	rid: string;
	state: boolean;
	publicChat?: boolean;
	setState: React.Dispatch<React.SetStateAction<boolean>>;
	handleClose?: (name: string, forced?: boolean) => void;
	side: 'left' | 'right';
	chatData?: Omit<ChatI, 'messages'>;
}

const DialogDrawer = (props: DialogDrawerProps) => {
	const drawerID = React.useId();
	const lgBreakpoint = useMediaQuery('(min-width:1200px)');
	const userData = useTypedSelector(store => store.user);
	const [settingsState, setSettingsState] = React.useState<boolean>(false);

	const username = parseChatUsername(props.chatData, userData?.username);
	const { data: friendData } = rtkApi.useUserChatDataQuery({ username });
	const currentDialogName = parseChatName(props.chatData, friendData);

	return (
		<SwipeableDrawer
			id={drawerID}
			elevation={4}
			swipeAreaWidth={35}
			// disableSwipeToOpen
			// hideBackdrop={!lgBreakpoint}
			keepMounted={false}
			anchor={props.side}
			open={props.state}
			aria-label='chat-sidebar'
			onClose={handleClose}
			onOpen={() => props.setState(true)}
			PaperProps={{
				sx: {
					...INSETS_PANEL(props.side),
					border: theme => (theme.palette.mode === 'light' ? '' : '1px solid lightgray'),
				},
			}}
			ModalProps={{
				sx: {
					zIndex: { md: '1201', lg: '1199' },
					top: TOP_SPACING,
					...getSideProps(props.side),
				},
			}}
		>
			<Stack
				gap={0}
				height='100%'
				direction='column'
				justifyContent='space-between'
				sx={{
					overflow: 'hidden',
					backgroundColor: theme =>
						theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.primary.main[200],
				}}
			>
				<Stack padding='.75rem .75rem' direction='row' justifyContent='space-between' alignItems='center'>
					{currentDialogName.length > 64 ? (
						<OnyxTypography component='div' tpColor='primary' tpSize='1.15rem' tpWeight='bold'>
							<OnyxTypography
								tpColor='primary'
								tpSize='1.15rem'
								tpWeight='bold'
								ttArrow
								ttFollow={false}
								ttPlacement='bottom'
								ttNode={currentDialogName}
								sx={{ cursor: 'help' }}
							>
								{currentDialogName.slice(0, 60).trimEnd() + '...'}&nbsp;&nbsp;
							</OnyxTypography>

							{props.chatData?.disabled && props.chatData?.status !== 'private' && (
								<ChatNamingChip variant='outlined' color='warning' label='только чтение' />
							)}
							{props.chatData?.status === 'private' && props.chatData?.name.includes('до:') && (
								<ChatNamingChip variant='outlined' color='warning' label='архив чата' />
							)}
						</OnyxTypography>
					) : (
						<OnyxTypography tpColor='primary' tpSize='1.15rem' tpWeight='bold'>
							{currentDialogName}&nbsp;&nbsp;
							{props.chatData?.disabled && props.chatData?.status !== 'private' && (
								<ChatNamingChip variant='outlined' color='warning' label='только чтение' />
							)}
							{props.chatData?.status === 'private' && props.chatData?.name.includes('до:') && (
								<ChatNamingChip variant='outlined' color='warning' label='архив чата' />
							)}
						</OnyxTypography>
					)}

					<Stack direction='row' alignItems='center' justifyContent='center' gap={1}>
						<OnyxTypography
							tpColor='primary'
							tpSize='.85rem'
							onClick={e => handleClose(e, true)}
							hoverStyles
							ttNode='Свернуть'
							ttFollow={false}
							ttPlacement='left'
							sx={{ maxHeight: '27.5px' }}
						>
							<StartOutlinedIcon
								sx={{
									transition: 'all .2s ease-in-out',
									transform: props.side === 'left' ? 'rotate(180deg)' : '',
								}}
							/>
						</OnyxTypography>

						{props.chatData?.status === 'private' && (
							<OnyxTypography
								tpColor='primary'
								tpSize='.85rem'
								onClick={() => setSettingsState(true)}
								hoverStyles
								ttNode='Параметры чата'
								ttFollow={false}
								ttPlacement='left'
								sx={{ maxHeight: '27.5px' }}
							>
								<SettingsIcon
									sx={{
										transition: 'all .2s ease-in-out',
										transform: props.side === 'left' ? 'rotate(180deg)' : '',
									}}
								/>
							</OnyxTypography>
						)}
					</Stack>
				</Stack>
				<Divider sx={{ width: '100%', margin: '0 auto' }} />

				<ChatContainer
					mode='full'
					sidebarChat
					disableHeader
					rid={props.rid}
					publicChat={props.publicChat}
					inputEnable={
						!props.chatData || (props.chatData.status === 'private' && props.chatData.name.includes('до:'))
							? false
							: !(props.chatData.disabled && SystemRolesOptions[userData._systemRole].accessLevel < 4)
					}
					sx={{ borderRadius: 'unset' }}
				/>
			</Stack>

			<ChatSettingsModal {...props} state={settingsState} setState={setSettingsState} />
		</SwipeableDrawer>
	);

	function handleClose(e: any, forced: boolean = false) {
		props.setState(false);
		if (props.handleClose && props.chatData?.name) props.handleClose(currentDialogName, forced);
	}
};

export function ChatNamingChip(payload: {
	label: string;
	variant: ComponentProps<typeof Chip>['variant'];
	color: ComponentProps<typeof Chip>['color'];
	sx?: SxProps;
}) {
	return (
		<Chip
			size='small'
			color={payload.color}
			variant={payload.variant}
			label={payload.label}
			sx={{
				padding: 'unset',
				height: 'unset',
				minWidth: 'unset',
				width: 'fit-content',
				whiteSpace: 'nowrap',
				fontWeight: 'normal',
				alignSelf: 'flex-start',
				span: { fontSize: '.75rem', paddingLeft: 'unset', paddingRight: 'unset', padding: '0 7px' },
				...payload.sx,
			}}
		/>
	);
}

function getSideProps(side: 'left' | 'right'): SxProps {
	return {
		left: side === 'left' ? { md: '0', lg: MESSENGER_SIDEBAR_WIDTH } : 'unset',
		right: side === 'left' ? 'unset' : { md: '0', lg: MESSENGER_SIDEBAR_WIDTH },
		borderTopLeftRadius: side === 'left' ? 'unset' : { md: 'unset', lg: '15px' },
		borderBottomLeftRadius: side === 'left' ? 'unset' : { md: 'unset', lg: '15px' },
		borderTopRightRadius: side === 'left' ? { md: 'unset', lg: '15px' } : 'unset',
		borderBottomRightRadius: side === 'left' ? { md: 'unset', lg: '15px' } : 'unset',
	};
}

export default DialogDrawer;
