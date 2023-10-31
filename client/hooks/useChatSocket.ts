import React from 'react';
import { rtkApi } from '../redux/api';
import { useTypedSelector } from '../redux/hooks';
import chatSocket, { PUBLIC_WS_ROOMS } from '../sockets/chat.ws';

/**
 * @IUnknown404I Component must be wrapped by AuthWrapper & ReduxWrapper & RTKQuerryWrapper.
 * @param passedRid: string or undefined as id of the server-room to connect.
 * @returns An Array[3]:
 * - chatSocket: Socket<ServerToClientEvents, ClientToServerEvents> custom instance;
 * - isConnected: boolean connection state between the client Socket and the server.
 */
export function useChatSocket(passedRid?: string): [typeof chatSocket, boolean, number] {
	const initialConnectionFlag = React.useRef<boolean>(true);
	const auth = useTypedSelector(state => state.auth);
	const userData = useTypedSelector(state => state.user);
	const [isConnected, setIsConnected] = React.useState<boolean>(chatSocket.connected);
	const [online, setOnline] = React.useState<number>(1);
	const { data, fulfilledTimeStamp: personalFulfilledTimeStamp } = rtkApi.usePersonalQuery('');

	React.useEffect(() => {
		chatSocket.on('connect', () => {
			setIsConnected(true);
			initialConnectionFlag.current = false;
		});

		chatSocket.io.on('reconnect', attempt => {
			setIsConnected(true);
			chatSocket.emit('message:send', {
				fio: 'rnadmin',
				rid: 'system',
				username: 'rnadmin',
				message: 'Reconnected succesfully!',
				timeSent: +new Date(),
			});
		});

		chatSocket.on('disconnect', () => {
			setIsConnected(false);
			chatSocket.disconnect();
		});

		chatSocket.on('room:data', roomData => {
			if (passedRid !== roomData.rid) return;
			setOnline(roomData.online || 1);
		});

		chatSocket.on('room:connect', payload => {
			if (passedRid !== payload.rid) return;
			setOnline(payload.online || 2);
		});

		chatSocket.on('room:disconnect', payload => {
			if (passedRid !== payload.rid) return;
			setOnline(payload.online || 1);
		});
	}, []);

	React.useEffect(() => {
		if (personalFulfilledTimeStamp === undefined) return;
		if (!isConnected) setIsConnected(true);

		chatSocket.emit('user:introduce', {
			rid: 'system',
			username: userData.username || '',
			fio: data?.name && data?.surname ? `${data.surname} ${data.name}` : '',
			timeSent: +new Date(),
		});

		if (passedRid && !PUBLIC_WS_ROOMS.includes(passedRid as (typeof PUBLIC_WS_ROOMS)[number]))
			chatSocket.emit('room:connect', {
				rid: passedRid,
				username: userData.username || '',
				fio: data?.name && data?.surname ? `${data.surname} ${data.name}` : '',
				timeSent: +new Date(),
			});
	}, [personalFulfilledTimeStamp]);

	React.useEffect(() => {
		if (auth) chatSocket.connect();
		else chatSocket.disconnect();

		return () => {
			// TODO: need to be profiled the pre-disconnect event
			// chatSocket.emit('user:pre-disconnect', { username: userData.username || '' });
			// chatSocket.disconnect();
		};
	}, [auth]);

	return [chatSocket, isConnected, online];
}
