import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotValidDataError } from 'errors/NotValidDataError';
import { Model } from 'mongoose';
import { User, UsersDocument } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { formatData } from 'utils/date-utils';
import { generateRandomString } from 'utils/utilityFunctions';
import {
	Chat,
	ChatContactsI,
	ChatMessageI,
	ChatParticipatorI,
	ChatsDocument,
	ModifiedChatMessageOption,
	UserChatDataI,
} from './chat.schema';
import { ChatMessagesRequestPayload } from './types.ws';

const DEFAULT_MESSAGES_COUNT_SENDING = 25;

@Injectable()
export class ChatService {
	constructor(
		@InjectModel(Chat.name, 'onyxDB') private chatsModel: Model<ChatsDocument>,
		@InjectModel(User.name, 'onyxDB') private usersModel: Model<UsersDocument>,
		readonly usersService: UsersService,
	) {}

	async getAllMessagesFromChat(rid: string): Promise<ChatMessageI[]> {
		if (!rid) throw new NotValidDataError();
		const chat = await this.chatsModel.findOne({ rid });
		if (!chat) throw new NotValidDataError();
		return chat.messages;
	}

	async getMessagesFromChat(payload: Omit<ChatMessagesRequestPayload, 'username'>): Promise<ChatMessageI[]> {
		if (!payload.rid) return;
		const chatData = await this.chatsModel.findOne({ rid: payload.rid });
		// if (chatData.messages)

		let requestedMessages: ChatMessageI[] = [];
		if (!payload.count && !payload.from)
			requestedMessages = chatData.messages.slice(-DEFAULT_MESSAGES_COUNT_SENDING);
		else if (payload.from && payload.count)
			requestedMessages = chatData.messages.slice(
				requestedMessages.length - payload.from,
				requestedMessages.length + (payload.from - payload.count),
			);
		else if (payload.from)
			requestedMessages = chatData.messages.slice(
				requestedMessages.length - payload.from,
				requestedMessages.length + (payload.from - DEFAULT_MESSAGES_COUNT_SENDING),
			);
		else if (payload.count) requestedMessages = chatData.messages.slice(-(payload.count + 1));

		if (!requestedMessages) return [];
		return requestedMessages;
	}

	async saveMessage(message: ChatMessageI): Promise<void> {
		if (!!!message.rid) return;
		const chatData = await this.chatsModel.findOne({ rid: message.rid });
		if (!chatData) throw new NotValidDataError();

		let chatMessages = [...chatData.messages];
		chatMessages.push(message);

		// check for limits-overflow
		if (chatMessages.length > parseInt(process.env.CHATS_MESSAGES_LIMIT)) chatMessages = chatMessages.slice(-300);

		// 	$push: { messages: message },
		this.chatsModel
			.updateOne(
				{ rid: message.rid },
				{
					messages: chatMessages,
				},
			)
			.exec();
	}

	async modifyMessage(payload: {
		message: ChatMessageI;
		text: string;
		modified?: ModifiedChatMessageOption;
	}): Promise<void> {
		if (!!!payload.message.rid) return;
		const chatData = await this.chatsModel.findOne({ rid: payload.message.rid });
		if (!chatData.messages || chatData.messages.length === 0) return;

		const actualMessages = chatData.messages.map(message =>
			message.rid === payload.message.rid &&
			message.username === payload.message.username &&
			message.timeSent === payload.message.timeSent &&
			message.message === payload.message.message
				? {
						...message,
						message: payload.text,
						modified: payload.modified || { timestamp: +new Date(), by: '' },
				  }
				: message,
		);

		// $pull: { messages: payload },
		this.chatsModel.updateOne({ rid: payload.message.rid }, { messages: actualMessages }).exec();
	}

	async deleteMessage(payload: ChatMessageI): Promise<void> {
		if (!!!payload.rid) return;
		const chatData = await this.chatsModel.findOne({ rid: payload.rid });
		if (!chatData.messages || chatData.messages.length === 0) return;

		const actualMessages = chatData.messages.filter(
			message =>
				!(
					message.rid === payload.rid &&
					message.username === payload.username &&
					message.timeSent === payload.timeSent &&
					message.message === payload.message
				),
		);

		// grades: { $elemMatch: { grade: { $lte: 90 }, mean: { $gt: 80 } } }
		// { $set: { "grades.$.std" : 6 } }
		this.chatsModel.updateOne({ rid: payload.rid }, { messages: actualMessages }).exec();
	}

	async getAllRids(): Promise<string[]> {
		const chats = await this.chatsModel.find().exec();
		return chats.map(chat => chat.rid);
	}

	async getUserChats(username: string) {
		if (!username) throw new NotValidDataError();
		const user = await this.usersModel.findOne({ username }).exec();
		if (!user) throw new NotValidDataError();
		return user.chats;
	}

	async findPrivateChatRid(username1: string, username2: string): Promise<{ rid: string }> {
		if (!username1 || !username2) throw new NotValidDataError('Передано недостаточно данных!');

		const user1Chats = (await this.getUserChats(username1)).private;
		if (!user1Chats || user1Chats.length < 1) throw new NotValidDataError('');

		for (const rid of user1Chats) {
			const chatData = await this.chatsModel.findOne({ rid });
			if (chatData) {
				const chatUsernames = chatData.participators.map(participator => participator.username);
				if (chatUsernames.includes(username1) && chatUsernames.includes(username2))
					return { rid: chatData.rid };
			} else continue;
		}
	}

	async createPrivateChat(
		creatorUsername: string = 'system',
		name: string,
		initialUsers?: string[],
	): Promise<undefined | string> {
		const timeStamp = +new Date();

		// check all passed initial username
		const verifiedUsers: ChatParticipatorI[] = [{ username: creatorUsername, inTimestamp: timeStamp }];
		const verifiedUsersFios: { [key: string]: string } = {};

		if (!!initialUsers && initialUsers.length > 0) {
			for (const username of initialUsers) {
				if (username !== creatorUsername && !!(await this.usersService.findUser({ username }))) {
					const userData = await this.getUserChatData(username);
					verifiedUsersFios[username] = `${userData.surname} ${userData.name}`;
					verifiedUsers.push({ username, inTimestamp: timeStamp });
				}
			}
		}
		if (!verifiedUsersFios[creatorUsername]) {
			// verify creator-fio has been parsed
			const creatorUserData = await this.getUserChatData(creatorUsername);
			verifiedUsersFios[creatorUsername] = `${creatorUserData.surname} ${creatorUserData.name}`;
		}

		// chat creating
		const rid = generateRandomString(64);
		const chatObject: Chat = {
			rid,
			name,
			online: 0,
			status: 'private',
			messages: [
				...verifiedUsers.map(participator =>
					this.createSystemMessage({
						rid,
						message: `${verifiedUsersFios[participator.username]} присоединился к чату`,
					}),
				),
			],
			meta: { createdAt: timeStamp, createdBy: creatorUsername },
			participators: verifiedUsers,
		};

		try {
			await this.chatsModel.create(chatObject);
		} catch (e) {
			return undefined;
		}

		// adding rid to the passed user's chats
		if (verifiedUsers.length > 0) {
			for (const participator of verifiedUsers) {
				await this.usersModel.updateOne(
					{ username: participator.username },
					{ $push: { 'chats.private': rid } },
				);
			}
		}

		return rid;
	}

	async leavePrivateChat(payload: { username: string; rid: string }): Promise<string> {
		// const chatData = await this.getChatData(payload.rid);
		const chatData = await this.chatsModel.findOne({ rid: payload.rid });
		if (!chatData || !chatData.participators.find(participator => participator.username === payload.username))
			throw new NotValidDataError('Сформирован неверный запрос!');

		// leave from the chat
		await this.usersModel.updateOne({ username: payload.username }, { $pull: { 'chats.private': payload.rid } });

		// update chat or delete it
		if (chatData.participators.length === 1 && chatData.participators[0].username === payload.username)
			await this.chatsModel.deleteOne({ rid: payload.rid });
		else {
			await this.chatsModel.updateOne(
				{ rid: payload.rid },
				{
					participators: chatData.participators.filter(
						participator => participator.username !== payload.username,
					),
				},
			);

			// update chatName for the last user
			const parsedDate = formatData(new Date(), { mode: 'full_short' });
			const newChatName = `${payload.username} до: `;

			// check for deleted chat already exist
			const searchedChats = await this.chatsModel.find({ name: { $regex: newChatName, $options: 'i' } }).exec();
			const chatObjectOrUndefined = searchedChats?.length
				? searchedChats.filter(
						chat =>
							chat.status === 'private' &&
							!!chat.participators.find(
								participator =>
									participator.username ===
									chatData.participators.find(
										participator => participator.username !== payload.username,
									).username,
							),
				  )[0]
				: undefined;

			// concat actual messages to existing archieved chat's messages
			if (!!chatObjectOrUndefined) {
				// update this chat
				await this.chatsModel.updateOne(
					{ rid: chatObjectOrUndefined.rid },
					{
						name: newChatName.concat(parsedDate),
						messages: chatObjectOrUndefined.messages.concat([
							...chatData.messages,
							this.createSystemMessage({
								rid: chatObjectOrUndefined.rid,
								message: 'Собеседник вышел из комнаты. Чат архивирован',
							}),
						]),
					},
				);

				// update remaining user
				await this.usersModel.updateOne(
					{ username: chatObjectOrUndefined.participators[0].username },
					{ $pull: { 'chats.private': payload.rid } },
				);
				// delete requested chat
				await this.chatsModel.deleteOne({ rid: chatData.rid });
			}
			// only update name if the chat doesnt exist
			else
				await this.chatsModel.updateOne(
					{ rid: payload.rid },
					{
						name: newChatName.concat(parsedDate),
						messages: [
							...chatData.messages,
							this.createSystemMessage({
								rid: chatData.rid,
								message: 'Собеседник вышел из комнаты. Чат архивирован.',
							}),
						],
					},
				);
		}
		return 'ok';
	}

	/**
	 * @throws NotValidDataError if room-id is invalid.
	 */
	async getChatData(rid: string) {
		const chat = await this.chatsModel.findOne({ rid }, { _id: 0, __v: 0, messages: 0 });
		if (!chat) throw new NotValidDataError('Предоставлен невалидный ключ комнаты!');
		return chat;
	}

	async getContactsByUsernameOrEmail(props: {
		email?: string;
		username?: string;
		requestedUsername?: string;
	}): Promise<ChatContactsI[]> {
		if (!props.email && !props.username) throw new NotValidDataError();
		const searchResult = await this.usersService.findAllEqualsByUSernameOrEmail(props);
		return searchResult
			.filter(
				user =>
					user.isActive &&
					!user.isBlocked &&
					user.metaInfo.contactVisibility &&
					(typeof props.requestedUsername === 'string' ? user.username !== props.requestedUsername : true),
			)
			.map(user => ({
				username: user.username,
				email: user.email,
				name: user.personal.name || user.username,
				surname: user.personal.surname || 'Пользователь',
				position: user.personal.position,
				avatar: user.personal.avatar,
			}));
	}

	async getUserChatData(username: string): Promise<UserChatDataI> {
		if (!username) throw new NotValidDataError();
		const userData = await this.usersModel.findOne({ username });
		if (!userData) throw new NotValidDataError();
		return {
			username,
			email: userData.email,
			name: userData.personal?.name || username,
			surname: userData.personal?.surname || 'Пользователь',
			position: userData.personal.position,
			avatar: userData.personal.avatar,
		};
	}

	async userPrivateParticipators(username: string): Promise<string[]> {
		if (!username) throw new NotValidDataError();
		const userData = await this.usersModel.findOne({ username });
		if (!userData) throw new NotValidDataError();

		const usernames: string[] = [];
		const privateChats = userData.chats.private;

		for (const rid of privateChats) {
			try {
				usernames.push(
					(await this.getChatData(rid)).participators.filter(user => user.username !== username)[0].username,
				);
			} catch (err) {}
		}
		return usernames;
	}

	createSystemMessage(payload: {
		rid: string;
		message: string;
		timeSent?: number;
		messageIdent?: string;
	}): ChatMessageI {
		return {
			rid: payload.rid,
			role: 'system',
			username: 'system',
			fio: payload.messageIdent || 'system notification',
			message: payload.message,
			timeSent: payload.timeSent || +new Date(),
		};
	}
}
