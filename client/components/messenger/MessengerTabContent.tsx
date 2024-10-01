import { Divider, Grow, Stack } from '@mui/material';
import React from 'react';
import { rtkApi } from '../../redux/api';
import { ChatMessageI, UserChatsObjectT } from '../../redux/endpoints/chatEnd';
import { useTypedDispatch, useTypedSelector } from '../../redux/hooks';
import { changeActiveSidebarDialog } from '../../redux/slices/messenger';
import chatSocket from '../../sockets/chat.ws';
import ModernLoader from '../utils/loaders/ModernLoader';
import { MessengerDialogBox } from './BasicComponents';
import { EmptyDialogsNotification, MessangerHelpTabContent } from './MessengerTabContentComponents';
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
				{props.tabIndex === 1 && <GroupOrPrivateDialogs {...props} type='group' handleClick={handleClick} />}
				{props.tabIndex === 2 && <GroupOrPrivateDialogs {...props} type='private' handleClick={handleClick} />}
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
				chats?.public.map(chat => <DialogBoxAndDialog {...props} key={chat} rid={chat} publicChat />)
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
				<DialogBoxAndDialog {...props} key={chat} rid={chat} />
			))}
			<Divider sx={{ width: '50%', margin: '.5rem auto' }} />
		</>
	) : (
		<EmptyDialogsNotification text='Пока что у вас нет групповых чатов!' />
	);
}

type SortedDialogItemType = {
	rid: string;
	type: 'active' | 'archive' | 'disabled';
	timestamp: number;
	dialogElement: JSX.Element;
};
function GroupOrPrivateDialogs(
	props: MessengerTabContentProps & { type: keyof UserChatsObjectT; handleClick: (name: string) => void },
) {
	const { data: chats, fulfilledTimeStamp } = rtkApi.useUserChatsQuery('');

	const [dialogObjects, setDialogObjects] = React.useState<SortedDialogItemType[]>([]);
	const sortedDialogs = React.useMemo<Array<JSX.Element>>(
		() =>
			dialogObjects?.length
				? dialogObjects.toSorted((a, b) => b.timestamp - a.timestamp).map(obj => obj.dialogElement)
				: [],
		[dialogObjects],
	);

	function updateChatData(payload: Omit<SortedDialogItemType, 'dialogElement'>) {
		setDialogObjects(prev =>
			prev.map(object =>
				object.rid === payload.rid ? { ...payload, dialogElement: object.dialogElement } : object,
			),
		);
	}

	React.useEffect(() => {
		if (!chats || chats[props.type].length === 0) return;
		if (
			Array.from(chats[props.type]).toSorted().join(' ') !==
			Array.from(dialogObjects.values())
				.map(el => el.rid)
				.toSorted()
				.join(' ')
		)
			setDialogObjects(
				chats[props.type].map(rid => ({
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
				})),
			);
	}, [chats, props]);

	return React.useMemo(
		() =>
			chats === undefined ? (
				<ModernLoader loading centered containerSx={{ marginTop: '1rem' }} />
			) : !!chats[props.type] && Array.isArray(chats[props.type]) && chats[props.type].length > 0 ? (
				<>
					{!!chats && sortedDialogs.length ? (
						sortedDialogs
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
				<EmptyDialogsNotification
					text={`Пока что у вас нет ${props.type === 'private' ? 'личных' : 'групповых'} чатов!`}
				/>
			),
		[chats, sortedDialogs],
	);
}

function DialogBoxAndDialog(
	props: MessengerTabContentProps & {
		rid: string;
		title?: string;
		publicChat?: boolean;
		updateData?: (payload: Omit<SortedDialogItemType, 'dialogElement'>) => void;
	},
) {
	const dispatch = useTypedDispatch();
	const userData = useTypedSelector(store => store.user);
	const activeDialogState = useTypedSelector(store => store.messenger.activeDialog);

	const fired = React.useRef<boolean>(false);
	const [lastMessage, setLastMessage] = React.useState<ChatMessageI>();
	const [drawerState, setDrawerState] = React.useState<boolean>(false);

	const { data: chatData, fulfilledTimeStamp } = rtkApi.useChatDataQuery(props.rid);

	const username = parseChatUsername(chatData, userData?.username);
	const { data: friendData } = rtkApi.useUserChatDataQuery({ username });
	const currentDialogName = parseChatName(chatData, friendData);

	React.useEffect(() => {
		if (!props.updateData) return;
		if (!chatData) {
			fired.current = true;
			return;
		}
		updateMessageData();
	}, [lastMessage]);

	React.useEffect(() => {
		if (!props.updateData) return;
		if (!!chatData && fired.current) updateMessageData();
	}, [chatData]);

	function updateMessageData() {
		if (!props.updateData) return;
		try {
			props.updateData({
				rid: props.rid,
				timestamp: lastMessage?.timeSent || 0,
				type:
					chatData!.disabled && chatData!.status === 'private'
						? 'archive'
						: chatData!.disabled
						? 'disabled'
						: 'active',
			});
		} catch (err) {}
	}

	chatSocket.on('room:data', payload => {
		if (
			payload.rid === props.rid &&
			!!payload.messages.slice(-1)[0]?.timeSent &&
			lastMessage?.timeSent !== payload.messages.slice(-1)[0]?.timeSent
		)
			setLastMessage(payload.messages.slice(-1)[0]);
	});

	chatSocket.on('message:send', payload => {
		if (payload.rid === props.rid && !!payload.timeSent && lastMessage?.timeSent !== payload.timeSent)
			setLastMessage(payload);
	});

	chatSocket.on('message:send/reply', payload => {
		if (payload.rid === props.rid && !!payload.timeSent && lastMessage?.timeSent !== payload.timeSent)
			setLastMessage(payload);
	});

	chatSocket.on('message:modify/reply', payload => {
		if (
			payload.message.rid === props.rid &&
			!!payload.message.timeSent &&
			lastMessage?.timeSent !== payload.message.timeSent
		)
			setLastMessage({ ...payload.message, message: payload.text });
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
				disabledChat={chatData?.disabled}
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

export default MessengerTabContent;
