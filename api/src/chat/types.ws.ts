import { Server } from 'socket.io';
import { ChatMessageI } from './chat.schema';

export type IOServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	username: string;
	fio: string;
	sessionStarted: number;
	role: string;
}

export interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;

	system: (payload: { rid?: string; message: string }) => void;
	'room:connect': (payload: { rid: string; fio: string; onine: number }) => void;
	'room:disconnect': (payload: { rid: string; fio: string; onine: number }) => void;
	'room:data': (payload: { rid: string; messages: ChatMessageI[]; online: number }) => void;

	'message:send': (payload: ChatMessageI) => void;
	'message:send/reply': (payload: ChatMessageI) => void;
	'message:modify': (payload: { message: ChatMessageI; text: string }) => void;
	'message:modify/reply': (payload: { message: ChatMessageI; text: string }) => void;
	'message:delete': (payload: ChatMessageI) => void;
	'message:delete/reply': (payload: ChatMessageI) => void;
}

export interface ClientToServerEvents {
	'user:introduce': (payload: Omit<ChatMessageI, 'message'>) => void;

	'room:connect': (payload: Omit<ChatMessageI, 'message'>) => void;
	'room:disconnect': (payload: Omit<ChatMessageI, 'message'>) => void;
	'room:data/request': (payload: ChatMessagesRequestPayload) => void;

	'message:send': (payload: ChatMessageI) => void;
	'message:modify': (payload: { message: ChatMessageI; text: string }) => void;
	'message:delete': (payload: ChatMessageI) => void;
}

export interface ChatMessagesRequestPayload {
	rid: string;
	username: string;
	count?: number;
	from?: number;
}
