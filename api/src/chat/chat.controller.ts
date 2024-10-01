import { Body, Controller, Get, Param, Post, Put, Query, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotValidDataError } from 'errors/NotValidDataError';
import { StringValidationPipe } from 'globalPipes/StringValidationPipe';
import { UserData } from 'metadata/metadata-decorators';
import { UsersFriendsService } from 'src/users/users-friends.service';
import { User, UserFriendsI } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { UserChatDataI } from './chat.schema';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
	constructor(
		readonly usersService: UsersService,
		readonly usersFriendsService: UsersFriendsService,
		readonly chatsService: ChatService,
	) {}

	@Get('rids')
	@ApiTags('Chats')
	async getAllRids() {
		return this.chatsService.getAllRids();
	}

	@Get('')
	@ApiTags('Chats')
	async getUserChats(@UserData() userData: User) {
		return this.chatsService.getUserChats(userData.username);
	}

	@Get('data/group/:rid')
	@ApiTags('Chats')
	async getGroupChatData(@Param('rid') rid: string, @UserData() userData: User) {
		return await this.chatsService.getGroupChatData(rid, userData);
	}

	@Get('data/:rid')
	@ApiTags('Chats')
	async getChatData(@Param('rid') rid: string, @UserData() userData: User) {
		return await this.chatsService.getChatData(rid, userData);
	}

	@Get('messages/:rid')
	@ApiTags('Chats')
	async getChatMessages(@Param('rid') rid: string) {
		return await this.chatsService.getMessagesFromChat({ rid });
	}

	@Post('private')
	@ApiTags('Chats')
	async createPrivateChat(
		@UserData() userData: User,
		@Body('name', StringValidationPipe) name: string,
		@Body('initialUsers') initialUsers?: string[],
	) {
		const user = await this.usersService.findUser({ username: userData.username });
		if (!user) throw new UnauthorizedException();

		if (initialUsers && initialUsers.length === 2)
			for (const rid of user.chats.private) {
				const chatData = await this.chatsService.getChatData(rid, userData);
				if (
					chatData.participators.find(participator => participator.username === initialUsers[0]) &&
					chatData.participators.find(participator => participator.username === initialUsers[1])
				)
					throw new NotValidDataError('Приватный чат с пользователем уже существует!');
			}

		return await this.chatsService.createPrivateChat(userData.username, name, initialUsers);
	}

	@Put('private/leave/:rid')
	@ApiTags('Chats')
	async leavePrivateChat(@Param('rid') rid: string, @UserData() userData: User) {
		return await this.chatsService.leavePrivateChat({ username: userData.username, rid });
	}

	@Put('group/leave/:rid')
	@ApiTags('Chats')
	async leaveGroupChat(@Param('rid') rid: string, @UserData() userData: User) {
		// return await this.chatsService.leaveGroupChat({ username: userData.username, rid });
	}

	@Get('private/get-rid/:username')
	@ApiTags('Chats')
	async getPrivateChatRid(@Param('username', StringValidationPipe) username: string, @UserData() userData: User) {
		return await this.chatsService.findPrivateChatRid(userData.username, username);
	}

	@Get('contacts')
	@ApiTags('Chats')
	async getChatContacts(
		@UserData() userData: User,
		@Query('username') username?: string,
		@Query('email') email?: string,
	) {
		if (!username && !email) throw new NotValidDataError('Предоставлено недостаточно данных!');

		return await this.chatsService.getContactsByUsernameOrEmail({
			username,
			email,
			requestedUsername: userData.username,
		});
	}

	@Get('user-data/:username')
	@ApiTags('Chats')
	async getUserChatData(@Param('username') username: string): Promise<UserChatDataI> {
		if (username === 'system')
			return {
				username: 'system',
				email: 'umcmrg@yandex.ru',
				name: 'СДО',
				surname: 'Бот',
			};
		return await this.chatsService.getUserChatData(username);
	}

	@Get('user-participators/private')
	@ApiTags('Chats')
	async getUserPrivateParticipators(@UserData() userData: User): Promise<string[]> {
		return await this.chatsService.userPrivateParticipators(userData.username);
	}

	@Get('friends')
	@ApiTags('Users')
	async getUserFriends(@UserData() userData: User): Promise<UserFriendsI> {
		return await this.usersFriendsService.getUserFriends(userData.username);
	}

	@Put('friends/add')
	@ApiTags('Users')
	async updateUserFriends(
		@UserData() userData: User,
		@Body('friendUsername', StringValidationPipe) friendUsername: string,
	) {
		return await this.usersFriendsService.addUserFriend(userData.username, friendUsername);
	}

	@Put('friends/request')
	@ApiTags('Users')
	async requestUserFriends(
		@UserData() userData: User,
		@Body('friendUsername', StringValidationPipe) friendUsername: string,
	) {
		return await this.usersFriendsService.requestUserFriend(userData.username, friendUsername);
	}

	@Put('friends/request-reject')
	@ApiTags('Users')
	async requestRejectUserFriends(
		@UserData() userData: User,
		@Body('friendUsername', StringValidationPipe) friendUsername: string,
	) {
		return await this.usersFriendsService.requestRejectUserFriend(userData.username, friendUsername);
	}

	@Put('friends/reject')
	@ApiTags('Users')
	async rejectUserFriends(
		@UserData() userData: User,
		@Body('friendUsername', StringValidationPipe) friendUsername: string,
	) {
		return await this.usersFriendsService.rejectUserFriend(userData.username, friendUsername);
	}

	@Put('friends/delete')
	@ApiTags('Users')
	async deleteUserFriends(
		@UserData() userData: User,
		@Body('friendUsername', StringValidationPipe) friendUsername: string,
	) {
		return await this.usersFriendsService.deleteUserFriend(userData.username, friendUsername);
	}
}
