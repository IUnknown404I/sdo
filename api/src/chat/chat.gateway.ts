import { Logger } from '@nestjs/common';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { cookiesConfig } from 'utils/cookiesConfig';
import { isProductionMode } from 'utils/utilityFunctions';
import { ChatMessageI } from './chat.schema';
import { ChatService } from './chat.service';
import { ChatMessagesRequestPayload, IOServer } from './types.ws';

export const PUBLIC_CHATS_RID = ['general', 'help', 'notifications'];

@WebSocketGateway(4488, {
	// namespace: 'chat',
	path: '/chat/',
	cors: {
		origin: isProductionMode()
			? [process.env.SELF_CLIENT_DOMAIN, 'http://188.225.10.127:4040']
			: [
					process.env.SELF_CLIENT_DOMAIN,
					'http://188.225.10.127:4040',
					'http://localhost:4040',
					'http://localhost',
			  ],
		credentials: true,
		exposedHeaders: ['set-cookie'],
		allowEIO3: true,
	},
	cookie: cookiesConfig,
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private chatService: ChatService) {}

	@WebSocketServer() server: IOServer;
	private logger = new Logger('ChatGateway');

	private getRoomOnlineCount(rid: string): number {
		if (!rid) return 0;
		if (this.server._nsps.get('/')?.adapter?.rooms.get(rid))
			return this.server._nsps.get('/').adapter.rooms.get(rid).size;
		else return 0;
	}

	afterInit(server: IOServer) {
		server.disconnectSockets();
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.server.to(client.id).emit('system', { message: "You're welcome!" });
		if (!isProductionMode()) this.logger.verbose(`Connected socket ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		this.server.to(client.id).emit('system', { message: 'See you later!' });
		if (!isProductionMode()) this.logger.verbose(`Disconnected socket ${client.id}`);
	}

	@SubscribeMessage('user:introduce')
	async handleUserIntroduce(client: Socket, payload: Omit<ChatMessageI, 'message'>) {
		// socket data update
		client.data.username = payload.username;
		client.data.fio = payload.fio;
		client.data.sessionStarted = payload.timeSent;
		client.data.role = payload.role || 'common';

		// connects and update the state
		PUBLIC_CHATS_RID.forEach(async public_rid => {
			client.join(public_rid);
			const online = this.getRoomOnlineCount(public_rid);
			const messages = await this.chatService.getMessagesFromChat({ rid: public_rid });
			this.server.to(client.id).emit('room:data', {
				rid: public_rid,
				messages,
				online,
			});
			client.broadcast.in(public_rid).emit('room:connect', { rid: public_rid, fio: payload.fio, online });
		});
	}

	@SubscribeMessage('user:pre-disconnect')
	async handleUserPreDisconnect(client: Socket, payload: { username: string }): Promise<void> {}

	@SubscribeMessage('message:send')
	async handleSendMessage(client: Socket, payload: ChatMessageI): Promise<void> {
		if (payload.rid) {
			client.broadcast.in(payload.rid).emit('message:send', payload);
			this.server.to(client.id).emit('message:send/reply', payload);
			this.chatService.saveMessage({ ...payload });
		} else client.broadcast.in('system').emit('message:send', payload);
	}

	@SubscribeMessage('message:modify')
	async handleModifyMessage(client: Socket, payload: { message: ChatMessageI; text: string }): Promise<void> {
		if (!payload.message.rid) throw new WsException('Room identifier was not provided');
		const modifiedTimeStamp = +new Date();
		this.chatService.modifyMessage({
			...payload,
			modified: { timestamp: modifiedTimeStamp, by: client.data.username },
		});

		const replyMessage: { message: ChatMessageI; text: string } = {
			message: { ...payload.message, modified: { timestamp: modifiedTimeStamp, by: client.data.username } },
			text: payload.text,
		};
		this.server.in(payload.message.rid).emit('message:modify', replyMessage);
		this.server.to(client.id).emit('message:modify/reply', replyMessage);
	}

	@SubscribeMessage('message:delete')
	async handleDeleteMessage(client: Socket, payload: ChatMessageI): Promise<void> {
		if (!payload.rid) throw new WsException('Room identifier was not provided');
		this.chatService.deleteMessage(payload);

		this.server.in(payload.rid).emit('message:delete', payload);
		this.server.to(client.id).emit('message:delete/reply', payload);
	}

	@SubscribeMessage('room:connect')
	async handleConnectToRoom(client: Socket, payload: ChatMessageI) {
		if (!payload.rid) throw new WsException('Room identifier was not provided');
		client.join(payload.rid);
		const messages = await this.chatService.getMessagesFromChat({ rid: payload.rid });
		this.server
			.to(client.id)
			.emit('room:data', { rid: payload.rid, messages, online: this.getRoomOnlineCount(payload.rid || '') });
		client.broadcast.in(payload.rid).emit('room:connect', { rid: payload.rid, fio: payload.fio });
	}

	@SubscribeMessage('room:disconnect')
	async handleDisconnectToRoom(client: Socket, payload: ChatMessageI) {
		if (!payload.rid) throw new WsException('Room identifier was not provided');
		client.broadcast.in(payload.rid).emit('room:disconnect', {
			rid: payload.rid,
			fio: payload.fio,
			online: this.getRoomOnlineCount(payload.rid),
		});
		client.leave(payload.rid);
	}

	@SubscribeMessage('room:data/request')
	async handleRoomMessagesRequest(client: Socket, payload: ChatMessagesRequestPayload) {
		if (!payload.rid) throw new WsException('Room identifier was not provided');
		const messages = await this.chatService.getMessagesFromChat(payload);
		this.server
			.to(client.id)
			.emit('room:data', { rid: payload.rid, messages, online: this.getRoomOnlineCount(payload.rid || '') });
	}
}
