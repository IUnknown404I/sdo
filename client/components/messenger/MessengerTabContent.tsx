import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import DoDisturbOffIcon from '@mui/icons-material/DoDisturbOff';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import InfoIcon from '@mui/icons-material/Info';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import { Divider, Grow, Paper, Stack, SxProps } from '@mui/material';
import React, { ReactNode } from 'react';
import { rtkApi } from '../../redux/api';
import { ChatMessageI } from '../../redux/endpoints/chatEnd';
import { useTypedDispatch, useTypedSelector } from '../../redux/hooks';
import { changeActiveSidebarDialog, selectMessenger } from '../../redux/slices/messenger';
import chatSocket from '../../sockets/chat.ws';
import OnyxSwitch from '../basics/OnyxSwitch';
import { OnyxTypography } from '../basics/OnyxTypography';
import ModernLoader from '../utils/loaders/ModernLoader';
import { MessengerDialogBox } from './BasicComponents';
import { parseChatName, parseChatUsername } from './chatContainer/ChatContainerComponent';
import DialogDrawer from './sidebarComponents/DialogDrawer';
import { DialogType } from './sidebarComponents/MessengerSidebar';

interface MessengerTabContentProps {
	tab: number;
	tabIndex: number;
	activeDialog?: DialogType;
	onDialogBoxClick?: (name: string) => void;
	handleDialogManualClose?: (name: string, forced?: boolean) => void;
	side: 'left' | 'right';
}

function MessengerTabContent(props: MessengerTabContentProps) {
	const handleClick = (name: string) => {
		if (props.onDialogBoxClick) props.onDialogBoxClick(name);
	};

	return (
		<Grow in={props.tab === props.tabIndex} timeout={750} key={props.tabIndex}>
			<Stack gap={1} display={props.tab === props.tabIndex ? '' : 'none'}>
				{props.tabIndex === 0 && <PublicDialogs {...props} handleClick={handleClick} />}
				{props.tabIndex === 1 && <GroupDialogs {...props} handleClick={handleClick} />}
				{props.tabIndex === 2 && <PrivateDialogs {...props} handleClick={handleClick} />}
				{props.tabIndex === 3 && <MessangerHelpTabContent mode='small' />}
			</Stack>
		</Grow>
	);
}

function PublicDialogs(props: MessengerTabContentProps & { handleClick: (name: string) => void }) {
	const { data: chats, fulfilledTimeStamp } = rtkApi.useUserChatsQuery('');
	return (
		<>
			{fulfilledTimeStamp === undefined ? (
				<ModernLoader loading centered containerSx={{ marginTop: '1rem' }} />
			) : (
				chats?.public.map(chat => <DialogBoxAndDialog {...props} rid={chat} publicChat />)
			)}
		</>
	);
}

function GroupDialogs(props: MessengerTabContentProps & { handleClick: (name: string) => void }) {
	const { data: chats, fulfilledTimeStamp } = rtkApi.useUserChatsQuery('');
	return fulfilledTimeStamp === undefined ? (
		<ModernLoader loading centered containerSx={{ marginTop: '1rem' }} />
	) : chats?.group && Array.isArray(chats.group) && chats.group.length > 0 ? (
		<>
			{chats.group.map(chat => (
				<DialogBoxAndDialog {...props} rid={chat} />
			))}
			<Divider sx={{ width: '50%', margin: '.5rem auto' }} />
		</>
	) : (
		<EmptyDialogsNotification text='Пока что у вас нет групповых чатов!' />
	);
}

type SortedDialogItemType = {
	rid: string;
	type: 'active' | 'archive';
	timestamp: number;
	dialogElement: JSX.Element;
};
function PrivateDialogs(props: MessengerTabContentProps & { handleClick: (name: string) => void }) {
	const chats = useTypedSelector(store => selectMessenger(store))?.chats;
	const dialogsSortedArray = React.useRef<Array<SortedDialogItemType>>([]);

	async function updateChatData(payload: Omit<SortedDialogItemType, 'dialogElement'>) {
		let tempArray: typeof dialogsSortedArray.current = [];
		tempArray = dialogsSortedArray.current.map(object =>
			object.rid === payload.rid ? { ...payload, dialogElement: object.dialogElement } : object,
		);
		tempArray.sort((a, b) => b.timestamp - a.timestamp);
		dialogsSortedArray.current = tempArray;
	}

	React.useEffect(() => {
		if (!chats || chats.private.length === 0) return;
		if (
			Array.from(chats.private.values()).sort().concat('') !==
			Array.from(dialogsSortedArray.current.values())
				.map(el => el.rid)
				.concat('')
		)
			dialogsSortedArray.current = chats.private.map(rid => ({
				rid,
				timestamp: 0,
				type: 'active',
				dialogElement: (
					<DialogBoxAndDialog
						key={rid}
						{...props}
						rid={rid}
						onDialogBoxClick={props.handleClick}
						handleDialogManualClose={props.handleDialogManualClose}
						updateData={updateChatData}
					/>
				),
			}));
	}, [chats]);

	return chats === undefined ? (
		<ModernLoader loading centered containerSx={{ marginTop: '1rem' }} />
	) : chats?.private && Array.isArray(chats.private) && chats.private.length > 0 ? (
		<>
			{!!chats && dialogsSortedArray.current.length ? (
				dialogsSortedArray.current.map(object => object.dialogElement)
			) : (
				<Stack direction='row' gap={1} margin='1rem auto 0' width='fit-content'>
					<ModernLoader loading />
					<ModernLoader loading />
					<ModernLoader loading />
				</Stack>
			)}
			<Divider sx={{ width: '50%', margin: '.5rem auto' }} />
		</>
	) : (
		<EmptyDialogsNotification text='Пока что у вас нет личных чатов!' />
	);
}

function DialogBoxAndDialog(
	props: MessengerTabContentProps & {
		rid: string;
		title?: string;
		publicChat?: boolean;
		updateData?: (payload: Omit<SortedDialogItemType, 'dialogElement'>) => Promise<void>;
	},
) {
	const dispatch = useTypedDispatch();
	const activeDialogState = useTypedSelector(store => store.messenger.activeDialog);
	const userData = useTypedSelector(store => store.user);
	const [lastMessage, setLastMessage] = React.useState<ChatMessageI>();
	const [drawerState, setDrawerState] = React.useState<boolean>(false);

	const { data: chatData, fulfilledTimeStamp } = rtkApi.useChatDataQuery(props.rid);

	const username = parseChatUsername(chatData, userData?.username);
	const { data: friendData } = rtkApi.useUserChatDataQuery({ username });
	const currentDialogName = parseChatName(chatData, friendData);

	chatSocket.on('room:data', payload => {
		if (payload.rid === props.rid) setLastMessage(payload.messages.slice(-1)[0]);
	});

	chatSocket.on('message:send', payload => {
		if (payload.rid === props.rid) setLastMessage(payload);
	});

	chatSocket.on('message:send/reply', payload => {
		if (payload.rid === props.rid) setLastMessage(payload);
	});

	chatSocket.on('message:modify/reply', payload => {
		if (payload.message.rid === props.rid) setLastMessage({ ...payload.message, message: payload.text });
	});

	chatSocket.on('message:delete/reply', payload => {
		if (
			payload.rid === props.rid &&
			lastMessage &&
			lastMessage.timeSent === payload.timeSent &&
			lastMessage.username === payload.username
		)
			setLastMessage({ ...payload, message: '... Сообщение удалено ...' });
	});

	React.useEffect(() => {
		// check for other dialog click --> close
		if (drawerState && activeDialogState?.name !== currentDialogName) setDrawerState(false);
	}, [activeDialogState]);

	React.useEffect(() => {
		// sync with emitting events in the chat
		if (!chatData || !props.updateData) return;
		props.updateData({
			rid: props.rid,
			type: chatData.name.includes('до:') ? 'archive' : 'active',
			timestamp: lastMessage?.timeSent || 0,
		});
	}, [lastMessage]);

	return (
		<>
			<MessengerDialogBox
				currentTab={props.tab}
				avatarUrl={friendData?.avatar}
				dialogName={currentDialogName}
				onClick={handleDialogClick}
				activeDialog={activeDialogState}
				lastMessage={lastMessage || undefined}
			/>
			<DialogDrawer
				rid={props.rid}
				state={drawerState}
				publicChat={props.publicChat}
				setState={setDrawerState}
				side={props.side}
				handleClose={handleDialogClick}
				chatData={chatData}
			/>
		</>
	);

	function handleDialogClick() {
		if (!chatData || fulfilledTimeStamp === undefined) return;

		if (activeDialogState?.name && activeDialogState.name !== currentDialogName) {
			// wait for current dialog close state
			setTimeout(() => setDrawerState(true), 500);
		} else if (activeDialogState?.name && activeDialogState.name === currentDialogName) {
			// if current is clicked dialog --> close
			setDrawerState(false);
		} else {
			// if current is undefined --> open
			setDrawerState(true);
		}

		dispatch(
			// throw new name if opened or undefined either
			changeActiveSidebarDialog(
				activeDialogState?.name !== currentDialogName ? { name: currentDialogName, tab: props.tab } : undefined,
			),
		);
	}
}

export function EmptyDialogsNotification(props: { text: string; size?: 'small' | 'medium' }) {
	return (
		<Stack direction='column' gap={2} justifyContent='center' alignItems='center' margin='1.5rem 0'>
			<SpeakerNotesOffIcon
				color='primary'
				sx={{ fontSize: !props.size || props.size === 'small' ? '1.5rem' : '2rem' }}
			/>
			<OnyxTypography
				text={props.text}
				tpColor='primary'
				tpSize={!props.size || props.size === 'small' ? '.85rem' : '1rem'}
			/>
		</Stack>
	);
}

export function MessangerHelpTabContent(props: { mode?: 'small' | 'normal' }) {
	const isNormalMode = props.mode !== 'small';
	return (
		<Stack component='section' padding='0 .75rem' height='100%' width='100%' gap={isNormalMode ? 2 : 1}>
			<HelpSectionWrapper isNormalMode={isNormalMode}>
				<HelpTitle title='Мессенджер платформы' icon={<InfoIcon />} isNormalMode={isNormalMode} />
				<CenteredFlexDiv isNormalMode={isNormalMode} gap={isNormalMode ? 3 : 2}>
					<MarkChatReadIcon color='primary' sx={{ fontSize: isNormalMode ? '2.5rem' : '2rem' }} />
					<OnyxTypography>
						<strong>Общение в системе</strong> - ипользуйте встроенный мессенджер для общения с коллегами и
						преподавателями. Задавайте и отвечайте на вопросы, получайте системные уведомления.
					</OnyxTypography>
				</CenteredFlexDiv>
				<CenteredFlexDiv isNormalMode={isNormalMode} gap={isNormalMode ? 3 : 2}>
					<YoutubeSearchedForIcon color='primary' sx={{ fontSize: isNormalMode ? '2.5rem' : '2rem' }} />
					<OnyxTypography>
						<strong>Поиск контактов</strong> - пользуйтесь поиском контактов по логину или адресу
						электронной почты.
					</OnyxTypography>
				</CenteredFlexDiv>
				<CenteredFlexDiv isNormalMode={isNormalMode} gap={isNormalMode ? 3 : 2}>
					<GroupAddIcon color='primary' sx={{ fontSize: isNormalMode ? '2.5rem' : '2rem' }} />
					<OnyxTypography>
						<strong>Список друзей</strong> - находите и добавляйте коллег или преподавателей в список
						друзей, так всегда можно быстро задать вопрос или найти нужный контакт у себя в профиле.
					</OnyxTypography>
				</CenteredFlexDiv>
			</HelpSectionWrapper>

			<Divider sx={{ width: '75%', margin: '.75rem auto' }} />
			<HelpSectionWrapper isNormalMode={isNormalMode}>
				<HelpTitle title='Типы чатов' icon={<MarkUnreadChatAltIcon />} isNormalMode={isNormalMode} />
				<CenteredFlexDiv isNormalMode={isNormalMode} gap={isNormalMode ? 3 : 2}>
					<AllInclusiveIcon color='primary' sx={{ fontSize: isNormalMode ? '2.5rem' : '2rem' }} />
					<OnyxTypography>
						<strong>Системные чаты</strong> - чаты, доступные всем пользователям для свободной коммуникации.
					</OnyxTypography>
				</CenteredFlexDiv>
				<CenteredFlexDiv isNormalMode={isNormalMode} gap={isNormalMode ? 3 : 2}>
					<GroupRoundedIcon color='primary' sx={{ fontSize: isNormalMode ? '2.5rem' : '2rem' }} />
					<OnyxTypography>
						<strong>Групповые чаты</strong>, доступ к которым открывается на время прохождения обучения по
						соответствующей программе для всей группы.
					</OnyxTypography>
				</CenteredFlexDiv>
				<CenteredFlexDiv isNormalMode={isNormalMode} gap={isNormalMode ? 3 : 2}>
					<QuestionAnswerRoundedIcon color='primary' sx={{ fontSize: isNormalMode ? '2.5rem' : '2rem' }} />
					<OnyxTypography>
						<strong>Личные чаты</strong> - общение тет-а-тет с пользователями. Можно создавать приватные
						комнаты с найденными пользователями платформы. Для удобства пользователей можно добавлять в
						друзья.
					</OnyxTypography>
				</CenteredFlexDiv>
			</HelpSectionWrapper>

			<Divider sx={{ width: '75%', margin: '.75rem auto' }} />
			<HelpSectionWrapper isNormalMode={isNormalMode}>
				<HelpTitle
					title='Видимость профиля'
					isNormalMode={isNormalMode}
					icon={<PersonSearchIcon sx={{ fontSize: '2.15rem' }} />}
				/>
				<OnyxTypography>
					В вашем <strong>Профиле</strong>, во вкладке <strong>Настройки</strong> имеется параметр "
					<strong>Видимость профиля в системе</strong>". Этот параметр позволяет находить ваш контакт в
					системе другим пользователям. Если же его отключить, то через поиск контактов вас будет не найти,
					учтите это!
				</OnyxTypography>
				<CenteredFlexDiv isNormalMode={isNormalMode} justifyContent='center'>
					<Paper
						sx={{
							width: 'fit-content',
							maxWidth: '95%',
							fontSize: '.75rem',
							borderRadius: '15px',
							padding: !isNormalMode ? '.75rem 1rem' : '1.25rem 1.75rem',
						}}
					>
						<OnyxTypography
							text='Используется в чатах. Если включено, вас смогут найти другие пользователи.'
							tpColor='secondary'
							tpSize={!isNormalMode ? '.75rem' : ''}
						/>
						<OnyxSwitch
							size={!isNormalMode ? 'small' : 'medium'}
							disabled={true}
							label='Видимость профиля в системе'
							state={true}
							setState={() => {}}
							labelPlacement='end'
						/>
					</Paper>
				</CenteredFlexDiv>
			</HelpSectionWrapper>

			<Divider sx={{ width: '75%', margin: '.75rem auto' }} />
			<HelpSectionWrapper isNormalMode={isNormalMode} sx={{ border: '1px solid #d32f2f' }}>
				<HelpTitle
					color='error'
					title='Будьте внимательней!'
					icon={<DoDisturbOffIcon />}
					isNormalMode={isNormalMode}
				/>
				<OnyxTypography tpAlign={props.mode !== 'small' ? 'center' : undefined}>
					Пожалуйста, не делитесь персональной или личной информацией в чатах системы!
				</OnyxTypography>
				<OnyxTypography tpAlign={props.mode !== 'small' ? 'center' : undefined}>
					Администраторы платформы никогда не станут запрашивать чувствительную информацию в рамках чата и при
					необходимости сами свяжутся с вами вне цифровой системы.
				</OnyxTypography>
			</HelpSectionWrapper>
		</Stack>
	);
}

function HelpSectionWrapper(props: {
	children: React.ReactNode | React.ReactNode[];
	isNormalMode?: boolean;
	sx?: SxProps;
}) {
	return props.isNormalMode ? (
		<Paper
			sx={{
				width: '100%',
				borderRadius: '15px',
				padding: '1.5rem 1.5rem',
				...props.sx,
			}}
		>
			<Stack direction='column' gap={props.isNormalMode ? 1 : 1}>
				{props.children}
			</Stack>
		</Paper>
	) : (
		<Stack direction='column' gap={props.isNormalMode ? 1 : 1}>
			{props.children}
		</Stack>
	);
}

function HelpTitle(props: { title: string; color?: string; icon?: ReactNode; isNormalMode?: boolean }): JSX.Element {
	return (
		<OnyxTypography
			tpSize={props.isNormalMode ? '1.35rem' : '1.15rem'}
			tpWeight='bold'
			tpColor={props.color || 'primary'}
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				marginBottom: props.isNormalMode ? '1.5rem' : '.75rem',
				gap: '.75rem',
				'> svg': props.isNormalMode
					? {
							fontSize: '2rem',
					  }
					: {},
			}}
		>
			{!!props.icon && props.icon}
			{props.title}
		</OnyxTypography>
	);
}

function CenteredFlexDiv(props: {
	children?: ReactNode;
	direction?: 'row' | 'column';
	alignItems?: 'flex-end' | 'flex-start' | 'center' | 'stretch' | 'revert';
	justifyContent?: 'flex-end' | 'flex-start' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
	isNormalMode?: boolean;
	gap?: number;
	sx?: SxProps;
}): JSX.Element {
	return (
		<Stack
			width='100%'
			alignItems='center'
			justifyContent={props.justifyContent || 'flex-start'}
			direction={props.direction || 'row'}
			gap={props.gap !== undefined ? props.gap : 1}
			sx={props.sx}
		>
			{props.children !== undefined && props.children}
		</Stack>
	);
}

export default MessengerTabContent;
