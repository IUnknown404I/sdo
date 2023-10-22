import React from 'react';
import { rtkApi } from '../redux/api';
import { useTypedDispatch, useTypedSelector } from '../redux/hooks';
import { setUserChats } from '../redux/slices/messenger';

const CommunicationWrapper = (props: { children?: (string | JSX.Element) | (string | JSX.Element)[] }) => {
	const auth = useTypedSelector(state => state.auth);
	const dispatcher = useTypedDispatch();

	const { data: userChats, refetch: userChatsRefetch } = rtkApi.useUserChatsQuery('', {
		refetchOnMountOrArgChange: true,
		pollingInterval: 10 * 6e4,
	});

	// main public chats
	const { refetch: generalChatRefetch } = rtkApi.useChatDataQuery('general', {
		// refetchOnMountOrArgChange: true,
		// pollingInterval: 10 * 6e4,
	});
	const { refetch: helpChatRefetch } = rtkApi.useChatDataQuery('help', {
		// refetchOnMountOrArgChange: true,
		// pollingInterval: 10 * 6e4,
	});
	const { refetch: notificationsChatRefetch } = rtkApi.useChatDataQuery('notifications', {
		// refetchOnMountOrArgChange: true,
		// pollingInterval: 10 * 6e4,
	});

	React.useEffect(() => {
		if (!auth) return;

		userChatsRefetch();
		generalChatRefetch();
		helpChatRefetch();
		notificationsChatRefetch();
	}, [auth]);

	React.useEffect(() => {
		if (!!userChats && (userChats.public.length || userChats.group.length || userChats.private.length)) {
			dispatcher(setUserChats(userChats));
		} else dispatcher(setUserChats(undefined));
	}, [userChats]);

	return <>{props.children}</>;
};

export default CommunicationWrapper;
