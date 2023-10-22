import { Socket, io } from 'socket.io-client';
import { AccessTokenI } from '../redux/api';
import { checkProductionMode } from '../utils/utilityFunctions';
import { ClientToServerEvents, ServerToClientEvents } from './types';

export const WS_CONFIG = (bearer?: AccessTokenI) => {
	return {
		path: '/chat/',
		autoConnect: true,
		transports: ['websocket'],
		// reconnectionAttempts: 2,
		// extraHeaders: {
		// 	Authorization: bearer.access_token || '',
		// },
	};
};
export const WS_URL = (checkProductionMode() ? 'https://' : 'ws://') + process.env.NEXT_PUBLIC_WS_SERVER;

/**
 * @IUnknown404I WS Socket instance with all basic logic.
 */
const chatSocket = io(WS_URL, WS_CONFIG()) as Socket<ServerToClientEvents, ClientToServerEvents>;

export const PUBLIC_WS_ROOMS = ['general', 'help', 'notifications'] as const;

export default chatSocket;
