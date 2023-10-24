import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Query,
	Request,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotValidDataError } from 'errors/NotValidDataError';
import { StringValidationPipe } from 'globalPipes/StringValidationPipe';
import { AccessTokenGuard } from 'guards/AccessTokenGuard';
import { RefreshOrAccessTokenGuard } from 'guards/RefreshOrAccessTokenGuard';
import { AccessTokenPayload, UserFriendsI } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { UserChatDataI } from './chat.schema';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
	constructor(
		readonly usersService: UsersService,
		readonly chatsService: ChatService,
	) {}

	@Get('rids')
	@ApiTags('Chats')
	async getAllRids() {
		return this.chatsService.getAllRids();
	}

	@Get('')
	@ApiTags('Chats')
	@UseGuards(AccessTokenGuard)
	async getUserChats(@Request() req) {
		let usernameFromToken = '';
		if (req.headers?.authorization)
			usernameFromToken = (
				(await this.usersService.decodeJWT(req.headers.authorization.split(' ')[1])) as AccessTokenPayload
			)?.username;
		else usernameFromToken = (await this.usersService.findByRefreshToken(req.cookies.refreshToken))?.username;
		return this.chatsService.getUserChats(usernameFromToken);
	}

	@Get('data/:rid')
	@ApiTags('Chats')
	@UseGuards(AccessTokenGuard)
	async getChatData(@Param('rid') rid: string) {
		return await this.chatsService.getChatData(rid);
	}

	@Get('messages/:rid')
	@ApiTags('Chats')
	@UseGuards(AccessTokenGuard)
	async getChatMessages(@Param('rid') rid: string) {
		return await this.chatsService.getMessagesFromChat({ rid });
	}

	@Post('private')
	@ApiTags('Chats')
	@UseGuards(RefreshOrAccessTokenGuard)
	async createPrivateChat(
		@Request() req,
		@Body('name', StringValidationPipe) name: string,
		@Body('initialUsers') initialUsers?: string[],
	) {
		let usernameFromToken = '';
		if (req.headers?.authorization)
			usernameFromToken = (
				(await this.usersService.decodeJWT(req.headers.authorization.split(' ')[1])) as AccessTokenPayload
			)?.username;
		else usernameFromToken = (await this.usersService.findByRefreshToken(req.cookies.refreshToken))?.username;
		const user = await this.usersService.findUser({ username: usernameFromToken });
		if (!user) throw new UnauthorizedException();

		if (initialUsers && initialUsers.length === 2)
			for (const rid of user.chats.private) {
				const chatData = await this.chatsService.getChatData(rid);
				if (
					chatData.participators.find(participator => participator.username === initialUsers[0]) &&
					chatData.participators.find(participator => participator.username === initialUsers[1])
				)
					throw new NotValidDataError('Приватный чат с пользователем уже существует!');
			}

		return await this.chatsService.createPrivateChat(usernameFromToken, name, initialUsers);
	}

	@Put('private/leave/:rid')
	@ApiTags('Chats')
	@UseGuards(AccessTokenGuard)
	async leavePrivateChat(@Request() req, @Param('rid') rid: string) {
		if (!req.headers.authorization.split(' ')[1]) throw new UnauthorizedException();
		let usernameFromToken = (
			(await this.usersService.decodeJWT(req.headers.authorization.split(' ')[1])) as AccessTokenPayload
		)?.username;
		if (!usernameFromToken) throw new UnauthorizedException();

		return await this.chatsService.leavePrivateChat({ username: usernameFromToken, rid });
	}

	@Get('private/get-rid/:username')
	@ApiTags('Chats')
	@UseGuards(AccessTokenGuard)
	async getPrivateChatRid(@Request() req, @Param('username', StringValidationPipe) username: string) {
		let usernameFromToken = (
			(await this.usersService.decodeJWT(req.headers.authorization.split(' ')[1])) as AccessTokenPayload
		)?.username;
		if (!usernameFromToken) throw new UnauthorizedException();

		return await this.chatsService.findPrivateChatRid(usernameFromToken, username);
	}

	@Get('contacts')
	@ApiTags('Chats')
	@UseGuards(RefreshOrAccessTokenGuard)
	async getChatContacts(@Request() req, @Query('username') username?: string, @Query('email') email?: string) {
		if (!username && !email) throw new NotValidDataError('Предоставлено недостаточно данных!');

		let usernameFromToken = '';
		if (req.headers?.authorization)
			usernameFromToken = (
				(await this.usersService.decodeJWT(req.headers.authorization.split(' ')[1])) as AccessTokenPayload
			)?.username;
		else usernameFromToken = (await this.usersService.findByRefreshToken(req.cookies.refreshToken))?.username;

		return await this.chatsService.getContactsByUsernameOrEmail({
			username,
			email,
			requestedUsername: usernameFromToken,
		});
	}

	@Get('user-data/:username')
	@ApiTags('Chats')
	@UseGuards(RefreshOrAccessTokenGuard)
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
	@UseGuards(AccessTokenGuard)
	async getUserPrivateParticipators(@Request() req): Promise<string[]> {
		let usernameFromToken = ((await this.usersService.decodeJWT(
			req.headers.authorization.split(' ')[1],
		)) as AccessTokenPayload)!.username;
		if (!usernameFromToken) throw new NotValidDataError();
		return await this.chatsService.userPrivateParticipators(usernameFromToken);
	}

	@Get('friends')
	@ApiTags('Users')
	@UseGuards(AccessTokenGuard)
	async getUserFriends(@Request() req): Promise<UserFriendsI> {
		const decodedTokenData: AccessTokenPayload = (await this.usersService.decodeJWT(
			req.headers.authorization?.split(' ')[1],
		)) as AccessTokenPayload;
		return await this.usersService.getUserFriends(decodedTokenData.username);
	}

	@Put('friends/add')
	@ApiTags('Users')
	@UseGuards(AccessTokenGuard)
	async updateUserFriends(@Request() req, @Body('friendUsername', StringValidationPipe) friendUsername: string) {
		const decodedTokenData: AccessTokenPayload = (await this.usersService.decodeJWT(
			req.headers.authorization?.split(' ')[1],
		)) as AccessTokenPayload;
		return await this.usersService.addUserFriend(decodedTokenData.username, friendUsername);
	}

	@Put('friends/request')
	@ApiTags('Users')
	@UseGuards(AccessTokenGuard)
	async requestUserFriends(@Request() req, @Body('friendUsername', StringValidationPipe) friendUsername: string) {
		const decodedTokenData: AccessTokenPayload = (await this.usersService.decodeJWT(
			req.headers.authorization?.split(' ')[1],
		)) as AccessTokenPayload;
		return await this.usersService.requestUserFriend(decodedTokenData.username, friendUsername);
	}

	@Put('friends/request-reject')
	@ApiTags('Users')
	@UseGuards(AccessTokenGuard)
	async requestRejectUserFriends(
		@Request() req,
		@Body('friendUsername', StringValidationPipe) friendUsername: string,
	) {
		const decodedTokenData: AccessTokenPayload = (await this.usersService.decodeJWT(
			req.headers.authorization?.split(' ')[1],
		)) as AccessTokenPayload;
		return await this.usersService.requestRejectUserFriend(decodedTokenData.username, friendUsername);
	}

	@Put('friends/reject')
	@ApiTags('Users')
	@UseGuards(AccessTokenGuard)
	async rejectUserFriends(@Request() req, @Body('friendUsername', StringValidationPipe) friendUsername: string) {
		const decodedTokenData: AccessTokenPayload = (await this.usersService.decodeJWT(
			req.headers.authorization?.split(' ')[1],
		)) as AccessTokenPayload;
		return await this.usersService.rejectUserFriend(decodedTokenData.username, friendUsername);
	}

	@Put('friends/delete')
	@ApiTags('Users')
	@UseGuards(AccessTokenGuard)
	async deleteUserFriends(@Request() req, @Body('friendUsername', StringValidationPipe) friendUsername: string) {
		const decodedTokenData: AccessTokenPayload = (await this.usersService.decodeJWT(
			req.headers.authorization?.split(' ')[1],
		)) as AccessTokenPayload;
		return await this.usersService.deleteUserFriend(decodedTokenData.username, friendUsername);
	}
}
