import { SxProps } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { useChatSocket } from '../../../hooks/useChatSocket';
import { rtkApi } from '../../../redux/api';
import { ChatMessageI, ChatParticipatorI } from '../../../redux/endpoints/chatEnd';
import { useTypedSelector } from '../../../redux/hooks';
import { scrollDivToBottom } from '../../../utils/utilityFunctions';
import ChatContainerComponent from './ChatContainerComponent';

export function ChatContainer(props: ChatContainerProps) {
	const router = useRouter();
	const userData = useTypedSelector(state => state.user);
	const isFullMode = !!props.mode && props.mode === 'full';

	const [chatSocket, isSocketConnected, online] = useChatSocket(props.rid);
	// const [onlineUsers, setOnlineUsers] = React.useState<number>(0);
	const { refetch: manuallyRefreshChatData } = rtkApi.useChatMessagesQuery(props.rid || '');

	const messagesFromWS = React.useRef<ChatMessageI[]>([]);
	const [messages, setMessages] = React.useState<ChatMessageI[]>([]);

	const chatDomRef = React.useRef<HTMLDivElement>();
	const chatID = `${React.useId().replaceAll(':', '')}${props.rid ? `-${props.rid}` : ''}${
		props.sidebarChat ? '-sidebarChat' : ''
	}`;

	const [inputText, setInputText] = React.useState<string>('');
	const [emojisState, setEmojisState] = React.useState<boolean>(false);
	const { data: personalData, fulfilledTimeStamp: personalFulfilledTimeStamp } = rtkApi.usePersonalQuery('');

	// room-change event in full-page mode
	React.useEffect(() => {
		manuallyRefreshChatData()
			.then(res => res?.data)
			.then(messages => {
				if (!messages || !Array.isArray(messages)) return;
				messagesFromWS.current = messages;
				setMessages(messages);
				scrollDivToBottom(chatDomRef, 40);
			});
	}, [router.asPath]);

	// WS-logic
	React.useEffect(() => {
		// listen for incoming messages
		chatSocket.on('message:send', incomingMessage => {
			if (incomingMessage.rid !== props.rid) return;

			const lastMessage = messagesFromWS.current[messagesFromWS.current.length - 1];
			if (checkMessagesEquality(lastMessage, incomingMessage)) return;

			messagesFromWS.current = [...messagesFromWS.current, incomingMessage];
			setMessages(messagesFromWS.current);
		});

		// listen for already sent messages by other sockets to update data
		chatSocket.on('message:send/reply', incomingMessage => {
			if (incomingMessage.rid !== props.rid) return;

			const lastMessage = messagesFromWS.current[messagesFromWS.current.length - 1];
			if (checkMessagesEquality(lastMessage, incomingMessage)) return;

			messagesFromWS.current = [...messagesFromWS.current, incomingMessage];
			setMessages(messagesFromWS.current);
			scrollDivToBottom(chatDomRef);
		});

		// listen for modified messages
		chatSocket.on('message:modify', payload => {
			const newMessage: ChatMessageI = { ...payload.message, message: payload.text };
			messagesFromWS.current = messagesFromWS.current.map(message =>
				payload.message.rid === message.rid &&
				payload.message.username === message.username &&
				payload.message.fio === message.fio &&
				payload.message.timeSent === message.timeSent &&
				payload.message.message === message.message
					? newMessage
					: message,
			);
			setMessages(messagesFromWS.current);
		});

		// listen for deleting actions
		chatSocket.on('message:delete', payload => {
			messagesFromWS.current = messagesFromWS.current.filter(
				message =>
					!(
						payload.rid === message.rid &&
						payload.username === message.username &&
						payload.fio === message.fio &&
						payload.timeSent === message.timeSent &&
						payload.message === message.message
					),
			);
			setMessages(messagesFromWS.current);
		});

		// listen for initial chat messages
		chatSocket.on('room:data', roomData => {
			if (roomData.rid !== props.rid) return;
			const scrollFlag = chatDomRef.current
				? chatDomRef.current.scrollTop >= chatDomRef.current.scrollHeight - 50
				: false;

			messagesFromWS.current = roomData.messages;
			setMessages(roomData.messages);
			// setOnlineUsers(roomData.online);
			if (scrollFlag && props.mode !== 'line') scrollDivToBottom(chatDomRef, 40);
		});

		if (props.mode !== 'line') scrollDivToBottom(chatDomRef);
	}, []);

	// scrolling chat-conainer to bottom
	React.useEffect(() => {
		if (!emojisState || !document) return;

		if (props.sidebarChat) {
			const chatContainerDomElement = document.querySelector(`#${chatID}`);
			if (chatContainerDomElement) {
				setTimeout(() => chatContainerDomElement.scrollTo({ top: chatContainerDomElement.scrollHeight }), 150);
			}
		} else {
			if (!!document.scrollingElement) {
				setTimeout(
					() => document.scrollingElement!.scrollTo({ top: document.scrollingElement!.scrollHeight }),
					150,
				);
			}
		}
	}, [emojisState]);

	// auto-scrolling to the end per tab change or connect / reconnect ws-event
	React.useEffect(() => {
		if (props.mode !== 'line' && props.focused) scrollDivToBottom(chatDomRef);
	}, [props.focused]);

	// for refetch or update events
	React.useEffect(() => {
		if (props.mode !== 'line') scrollDivToBottom(chatDomRef);
	}, [chatSocket.connected]);

	return (
		<ChatContainerComponent
			{...props}
			chatID={chatID}
			online={online}
			isFullMode={isFullMode}
			isSocketConnected={isSocketConnected}
			messages={messages}
			emoji={{
				state: emojisState,
				setState: setEmojisState,
			}}
			inputText={{
				state: inputText,
				setState: setInputText,
			}}
			// @ts-ignore
			chatDomRef={chatDomRef}
			handleSendMessage={handleSendMessage}
			updateMessageText={updateMessageText}
		/>
	);

	function handleSendMessage() {
		if (!inputText.trim()) return;
		let parsedText = inputText.trim();

		while (parsedText.indexOf('\n\n\n') !== -1) parsedText = parsedText.replaceAll('\n\n\n', '\n\n');
		const messageData = {
			rid: props.rid || 'system',
			message: parsedText,
			fio:
				!!personalData && personalData.name && personalData.surname
					? `${personalData.surname} ${personalData.name}`
					: `Пользователь ${userData.username}`,
			timeSent: +new Date(),
			username: userData.username ? userData.username : 'Пользователь системы',
		};

		chatSocket.emit('message:send', messageData);
		setInputText('');
	}

	function updateMessageText(text: string) {
		setInputText(prev =>
			prev.endsWith(' ') || prev.endsWith('\n') || text.startsWith(' ') || text.startsWith('\n')
				? prev + text
				: prev + ` ${text}`,
		);
	}
}

function checkMessagesEquality(message?: ChatMessageI, incomingMessage?: ChatMessageI): boolean {
	return !!(
		message &&
		incomingMessage &&
		message.rid === incomingMessage.rid &&
		message.username === incomingMessage.username &&
		message.fio === incomingMessage.fio &&
		message.timeSent === incomingMessage.timeSent &&
		message.message === incomingMessage.message
	);
}

export interface ChatContainerProps {
	rid?: string;
	focused?: boolean;
	publicChat?: boolean;
	mode?: 'full' | 'line';
	sidebarChat?: boolean;
	inputEnable?: boolean;
	transparent?: boolean;
	bottomDivider?: boolean;
	disableHeader?: boolean;
	modalEmojis?: boolean;
	elevatedHeader?: boolean;
	align?: 'row' | 'column';
	participators?: ChatParticipatorI[];
	minHeight?: string;
	maxHeight?: string;
	sx?: SxProps;
}
