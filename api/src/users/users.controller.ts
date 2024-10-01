import {
	Body,
	Controller,
	Get,
	Header,
	Inject,
	Param,
	ParseBoolPipe,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	Query,
	Request,
	Response,
	StreamableFile,
	UnauthorizedException,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	forwardRef,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { existsSync, unlink } from 'fs';
import { EmailValidationPipe } from 'globalPipes/EmailValidationPipe';
import { PasswordValidationPipe } from 'globalPipes/PasswordValidationPipe';
import { StringOrUndefinedValidationPipe } from 'globalPipes/StringOrUndefinedValidationPipe';
import { FingerprintsGuard } from 'guards/FingerprintsGuard';
import { AccessLevel, SystemRoles, UserData } from 'metadata/metadata-decorators';
import mongoose from 'mongoose';
import { diskStorage } from 'multer';
import { expiredCookiesConfig } from 'utils/cookiesConfig';
import { NotValidDataError } from '../../errors/NotValidDataError';
import { StringValidationPipe } from '../../globalPipes/StringValidationPipe';
import { UsernameValidationPipe } from '../../globalPipes/UsernameValidationPipes';
import { UsersAuthService } from './users-auth-service';
import { UsersExportService } from './users-export.service';
import {
	SystemRolesOptions,
	User,
	UserCreationType,
	UserLoyalityBlockType,
	UserMetaInformationI,
	UserPersonalT
} from './users.schema';
import { PublicUserData, UsersService } from './users.service';

function importFileValidation(file: Express.Multer.File): boolean {
	const ALLOWED_TYPES: string[] = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
	return ALLOWED_TYPES.includes(file.mimetype);
}

@Controller('users')
export class UsersController {
	constructor(
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
		@Inject(forwardRef(() => UsersAuthService))
		private readonly usersAuthService: UsersAuthService,
		private readonly usersExportService: UsersExportService,
	) {}

	@Get('')
	@ApiTags('Users')
	async getUser(
		@Query('_id') _id: mongoose.Types.ObjectId,
		@Query('username', UsernameValidationPipe) username: string,
	): Promise<User | PublicUserData> {
		if (!_id && !username) throw new NotValidDataError();
		return await this.usersService.findUser({ _id, username });
	}

	@Get('loyality')
	@ApiTags('Users')
	async getUserLoyality(
		@UserData() userData: User,
		@Query('username') username?: string,
	): Promise<UserLoyalityBlockType> {
		return await this.usersService.getUserLoyality({ user: userData, requestedUsername: username });
	}

	@Patch('loyality/convert-energy')
	@ApiTags('Users')
	async convertUserEnergy(@UserData() userData: User): Promise<{ result: true }> {
		return await this.usersService.convertUserEnergy(userData);
	}

	@AccessLevel(4)
	@Patch('loyality/coin')
	@ApiTags('Users')
	async patchUserLoyalityCoins(
		@UserData() userData: User,
		@Body('coins', ParseIntPipe) coins: number,
		@Body('type') type?: 'inc' | 'dec',
		@Query('username') username?: string,
	): Promise<{ result: true }> {
		return await this.usersService.patchUserLoyalityCoins({
			user: userData,
			requestedUsername: username,
			coins,
			type,
		});
	}

	@AccessLevel(4)
	@Patch('loyality/experience')
	@ApiTags('Users')
	async patchUserLoyalityExperience(
		@UserData() userData: User,
		@Body('exp', ParseIntPipe) exp: number,
		@Body('type') type?: 'inc' | 'dec',
		@Query('username') username?: string,
	): Promise<{ result: true }> {
		return await this.usersService.patchUserLoyalityExperience({
			user: userData,
			requestedUsername: username,
			exp,
			type,
		});
	}

	@SystemRoles(['developer', 'admin'])
	@Post('advansed-search')
	@ApiTags('Users')
	async getUsersAdvancedSearch(
		@Body('username') username?: string,
		@Body('email') email?: string,
		@Body('isActive') isActive?: boolean | 'all',
		@Body('isBlocked') isBlocked?: boolean | 'all',
		@Body('creationType') creationType?: UserCreationType | 'all',
		@Body('systemRole') systemRole?: keyof typeof SystemRolesOptions | 'all',
		@Body('limit') limit?: number,
		@Body('from') from?: number,
	): Promise<{ users: User[]; total: number }> {
		return await this.usersService.getUsersAdvancedSearch({
			username,
			email,
			isActive,
			isBlocked,
			creationType,
			systemRole,
			limit,
			from,
		});
	}

	@SystemRoles(['developer', 'admin'])
	@Post('import')
	@ApiTags('Users')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter(req: any, file: any, cb: any) {
				cb(null, importFileValidation(file));
			},
			storage: diskStorage({
				destination: (req, file, cb) => {
					const uploadPath = 'public/users/import/';
					if (!existsSync(uploadPath)) cb(new NotValidDataError(), 'public/users/import/');
					else cb(null, uploadPath);
				},
				filename(req, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
					const requestedUserData = (req as typeof req & { guardUserData?: User & { _id: string } })
						.guardUserData;
					if (!requestedUserData) callback(new UnauthorizedException(), 'error');

					const filename = file.originalname.slice(0, file.originalname.lastIndexOf('.'));
					const fileExt = file.originalname.slice(file.originalname.lastIndexOf('.') + 1);
					const fileRandomName = Array(32)
						.fill(null)
						.map(() => Math.round(Math.random() * 32).toString(32))
						.join('');
					callback(null, `${requestedUserData.username}-${fileRandomName}.${fileExt}`);
				},
			}),
			limits: { fileSize: 5 * 1024 * 1024 },
		}),
	)
	async importUsersFromExcel(
		@UploadedFile() file: Express.Multer.File,
		@Request() req,
		@UserData() userData,
		@Query('skipAlreadyExistingUsers') skipAlreadyExistingUsers?: boolean,
	): Promise<{ imported: { username: string; email: string }[]; total: number }> {
		if (!userData) throw new UnauthorizedException();
		try {
			const importedInfo = await this.usersExportService.importUsersFromExcel(
				file.path,
				userData,
				skipAlreadyExistingUsers,
			);
			return {
				imported: importedInfo.imported.map(user => ({ username: user.username, email: user.email })),
				total: importedInfo.total,
			};
		} catch (e) {
			throw e;
		} finally {
			unlink(file.path, err => err);
		}
	}

	@SystemRoles(['developer', 'admin'])
	@Post('')
	@ApiTags('Users')
	async createUser(
		@Request() req,
		@UserData() userData,
		@Body('username', UsernameValidationPipe) username: string,
		@Body('password', PasswordValidationPipe) password: string,
		@Body('email', EmailValidationPipe) email: string,
		@Body('company') company?: string,
		@Query('activatedUser') activatedUser?: boolean,
	) {
		if (!userData) throw new UnauthorizedException();
		if (activatedUser !== undefined)
			this.usersService.createOne({
				username,
				password,
				email,
				company,
				activatedUser,
				creationType: `createdby-${(userData as User).username}`,
			});
		else
			this.usersService.createOne({
				username,
				password,
				email,
				company,
				creationType: `createdby-${(userData as User).username}`,
			});
	}

	@SystemRoles(['developer', 'admin'])
	@Post('byadmin')
	@ApiTags('Users')
	async createUserFromAdminLayer(
		@Request() req,
		@UserData() userData,
		@Body('username', UsernameValidationPipe) username: string,
		@Body('password', PasswordValidationPipe) password: string,
		@Body('email', EmailValidationPipe) email: string,
		@Body('isActive') isActive: boolean,
		@Body('isBlocked') isBlocked: boolean,
		@Body('_permittedSystemRoles') _permittedSystemRoles: (keyof typeof SystemRolesOptions)[],
		@Body('name') name?: string,
		@Body('surname') surname?: string,
		@Body('tel') tel?: string,
		@Body('city') city?: string,
		@Body('company') company?: string,
		@Body('position') position?: string,
		@Body('avatar') avatar?: string,
		@Query('sendEmailVerification') sendEmailVerification?: boolean,
	): Promise<{ result: true }> {
		if (!userData) throw new UnauthorizedException();
		if (!_permittedSystemRoles?.length)
			throw new NotValidDataError('Не предоставлены доступные роли пользователя!');
		await this.usersService.createUserFromAdminLayer({
			username,
			password,
			email,
			isActive,
			isBlocked,
			_permittedSystemRoles,
			name,
			surname,
			tel,
			city,
			company,
			position,
			avatar,
			createdBy: (userData as User).username,
			sendEmailVerification,
		});
		return { result: true };
	}

	@SystemRoles(['developer', 'admin'])
	@Put('byadmin/:username')
	@ApiTags('Users')
	async updateUserFromAdminLayer(
		@Request() req,
		@UserData() userData,
		@Param('username', UsernameValidationPipe) username: string,
		@Body('email', EmailValidationPipe) email: string,
		@Body('isActive') isActive: boolean,
		@Body('isBlocked') isBlocked: boolean,
		@Body('_permittedSystemRoles') _permittedSystemRoles: (keyof typeof SystemRolesOptions)[],
		@Body('password') password?: string,
		@Body('name') name?: string,
		@Body('surname') surname?: string,
		@Body('tel') tel?: string,
		@Body('city') city?: string,
		@Body('company') company?: string,
		@Body('position') position?: string,
	): Promise<{ result: true }> {
		if (!userData) throw new UnauthorizedException();
		await this.usersService.updateUserFromAdminLayer({
			requestedUser: userData as User,
			usernameToChange: username,
			password,
			email,
			isActive,
			isBlocked,
			_permittedSystemRoles,
			name,
			surname,
			tel,
			city,
			company,
			position,
		});
		return { result: true };
	}

	@SystemRoles(['developer', 'admin'])
	@Post('byadmin/send/activate-email/:username')
	@ApiTags('Users')
	async resendActiveEmailToUser(
		@UserData() userData,
		@Param('username', UsernameValidationPipe) username: string,
	): Promise<{ result: true }> {
		if (!userData) throw new UnauthorizedException();
		return this.usersService.resendActiveEmailToUser(username, userData as User);
	}

	@SystemRoles(['developer', 'admin'])
	@Put('block')
	@ApiTags('Users')
	async blockUsers(
		@UserData() userData,
		@Body('usernames') usernames: string[],
		@Body('isBlocked', ParseBoolPipe) isBlocked: boolean,
		@Body('reason') reason?: string,
	) {
		if (!userData) throw new UnauthorizedException();
		if (!usernames || !usernames.length || (isBlocked && !reason)) throw new NotValidDataError();

		for (const username of usernames) {
			const requestedUserData = await this.usersService.findUser({ username, secret: true });
			if (!requestedUserData) throw new NotValidDataError();
			if (
				SystemRolesOptions[requestedUserData.__systemRole].accessLevel >
					SystemRolesOptions[(userData as User).__systemRole].accessLevel &&
				(userData as User).__systemRole !== 'superuser'
			)
				throw new UnauthorizedException(
					'У вас недостаточно прав для выполнения этого действия над одним из выбранных пользователей!',
				);
		}

		for (const username of usernames) {
			if (username === (userData as User).username) continue;
			if (isBlocked) await this.usersAuthService.blockUser({ username, reason });
			else await this.usersAuthService.unBlockUser({ username });
		}
		return { result: true };
	}

	@SystemRoles(['developer', 'admin'])
	@Put('activate')
	@ApiTags('Users')
	async activateUsers(
		@UserData() userData,
		@Body('usernames') usernames: string[],
		@Body('isActive', ParseBoolPipe) isActive: boolean,
	): Promise<{ result: true }> {
		if (!userData) throw new UnauthorizedException();
		if (!usernames || !usernames.length) throw new NotValidDataError();

		for (const username of usernames) {
			const requestedUserData = await this.usersService.findUser({ username, secret: true });
			if (!requestedUserData) throw new NotValidDataError();
			if (
				SystemRolesOptions[requestedUserData.__systemRole].accessLevel >
					SystemRolesOptions[(userData as User).__systemRole].accessLevel &&
				(userData as User).__systemRole !== 'superuser'
			)
				throw new UnauthorizedException(
					'У вас недостаточно прав для выполнения этого действия над одним из выбранных пользователей!',
				);
		}

		for (const username of usernames) {
			if (username === (userData as User).username) continue;
			if (isActive) await this.usersAuthService.activateUser({ username });
			else await this.usersAuthService.disactivateUser({ username });
		}
		return { result: true };
	}

	@UseGuards(FingerprintsGuard)
	@Put('logout')
	@ApiTags('Users')
	async logoutUser(@Response() res, @UserData() userData, @Request() req) {
		if (!userData) throw new NotValidDataError();
		await this.usersAuthService.logoutUser(userData as User);

		res.cookie('refreshToken', '', expiredCookiesConfig);
		res.status(200).send('See you later!');
	}

	@SystemRoles(['developer', 'admin'])
	@Put('logout-force')
	@ApiTags('Users')
	async forcedUsersLogout(@UserData() userData, @Body('usernames') usernames: string[]): Promise<{ result: true }> {
		if (!userData) throw new UnauthorizedException();
		if (!usernames || !usernames.length) throw new NotValidDataError();

		const requestedUsersData: User[] = [];
		for (const username of usernames) {
			const requestedUserData = await this.usersService.findUser({ username, secret: true });
			if (!requestedUserData) throw new NotValidDataError();
			if (
				SystemRolesOptions[requestedUserData.__systemRole].accessLevel >
					SystemRolesOptions[(userData as User).__systemRole].accessLevel &&
				(userData as User).__systemRole !== 'superuser'
			)
				throw new UnauthorizedException(
					'У вас недостаточно прав для выполнения этого действия над одним из выбранных пользователей!',
				);
			requestedUsersData.push(requestedUserData);
		}

		for (const requestedUserData of requestedUsersData) await this.usersAuthService.logoutUser(requestedUserData);
		return { result: true };
	}

	@UseGuards(FingerprintsGuard)
	@Put('leave-meta')
	@ApiTags('Users')
	async onLeaveDataUpdate(
		@Request() req,
		@UserData() userData,
		@Body('lastPage', StringValidationPipe) lastPage: string,
	) {
		if (!userData) throw new UnauthorizedException();
		return await this.usersService.onLeaveDataUpdate({ username: (userData as User).username, lastPage });
	}

	@UseGuards(FingerprintsGuard)
	@Get('activity')
	@ApiTags('Users')
	async getMyActivity(@Request() req, @UserData() userData) {
		if (!userData) throw new UnauthorizedException();
		return this.usersService.getMyActivity(userData as User & { _id: string });
	}

	@UseGuards(FingerprintsGuard)
	@Put('activity')
	@ApiTags('Users')
	async updateMyActivity(@Request() req, @UserData() userData) {
		if (!userData) throw new UnauthorizedException();
		return this.usersService.updateMyActivity(userData as User & { _id: string });
	}

	@Get('personal')
	@ApiTags('Users')
	async getPersonalUserData(
		@Request() req,
		@UserData() userData,
		@Query('username') username?: string,
	): Promise<UserPersonalT> {
		if (!userData) throw new UnauthorizedException();
		if (!!username && SystemRolesOptions[(userData as User).__systemRole].accessLevel < 4)
			throw new UnauthorizedException(
				'У вас недостаточно прав для запроса пользовательской информации другого аккаунта!',
			);
		return await this.usersService.getUserPersonalData({ username: username || (userData as User).username });
	}

	@Put('personal')
	@ApiTags('Users')
	async updatePersonalUserdata(
		@Request() req,
		@UserData() userData,
		@Body('name', StringValidationPipe) name: string,
		@Body('surname', StringValidationPipe) surname: string,
		@Body('city', StringOrUndefinedValidationPipe) city?: string,
		@Body('company', StringOrUndefinedValidationPipe) company?: string,
		@Body('position', StringOrUndefinedValidationPipe) position?: string,
		@Body('tel', StringOrUndefinedValidationPipe) tel?: string,
		@Body('avatar', StringOrUndefinedValidationPipe) avatar?: string,
		@Body('username') username?: string,
	) {
		if (!userData) throw new UnauthorizedException();
		const parsedObject: UserPersonalT = {
			name,
			surname,
		};

		if (city) parsedObject.city = city;
		if (company) parsedObject.company = company;
		if (position) parsedObject.position = position;
		if (tel) parsedObject.tel = tel;
		if (avatar) parsedObject.avatar = avatar;

		return await this.usersService.updatePersonalUserData({
			ident: { username: username || (userData as User).username },
			requestedUserUsername: !!username ? (userData as User).username : undefined,
			personal: parsedObject,
		});
	}

	@Put('personal/email')
	@ApiTags('Users')
	async emailChange(
		@Request() req,
		@UserData() userData,
		@Body('email', StringValidationPipe) email: string,
		@Body('password', StringValidationPipe) password: string,
	) {
		if (!userData) throw new UnauthorizedException();
		const requestedUser = userData as User;

		const userValidateFlag = await this.usersAuthService.validateUser({
			username: requestedUser.username,
			password,
		});
		if (!userValidateFlag) throw new UnauthorizedException();
		this.usersService.updateLastEmailUpdateRequest({ username: requestedUser.username });

		// email comparisson with other users
		if (requestedUser.email === email)
			throw new NotValidDataError('Данная почта уже привязана к учетной записи! Укажите другую.');

		if ((await this.usersService.findUserByEmail(email, true))?.username != null)
			throw new NotValidDataError('Данная почта уже используется в системе! Укажите другую.');

		// generate and set the email token + writing requested email address and send verification email
		const newEmailToken = await this.usersAuthService.createEmailToken();
		this.usersService.updateRequestedEmailUser({ username: requestedUser.username, requestedEmail: email });
		this.usersService.updateRequestedEmailToken({ username: requestedUser.username, token: newEmailToken });
		return await this.usersAuthService.sendEmailChangeRequest({
			oldEmail: requestedUser.email,
			newEmail: email,
			verificationLink: newEmailToken,
		});
	}

	@Put('personal/password')
	@ApiTags('Users')
	async passwordChange(
		@Request() req,
		@UserData() userData,
		@Body('password', StringValidationPipe) password: string,
	) {
		if (!userData) throw new UnauthorizedException();
		const requestedUser = userData as User;

		const userValidateFlag = await this.usersAuthService.validateUser({
			username: requestedUser.username,
			password,
		});
		if (!userValidateFlag) throw new UnauthorizedException();
		this.usersService.updatePasswordRequestDate({ username: requestedUser.username });

		const newRecoveryToken = await this.usersAuthService.createRecoveryToken();
		this.usersService.updateRecoveryTokenValue({ username: requestedUser.username, newToken: newRecoveryToken });
		return await this.usersAuthService.sendPasswordChangeRequest({
			email: requestedUser.email,
			recoveryLink: newRecoveryToken,
		});
	}

	@Get('meta')
	@ApiTags('Users')
	async getUserMetaInfo(@Request() req, @UserData() userData): Promise<UserMetaInformationI> {
		if (!userData) throw new UnauthorizedException();
		return await this.usersService.getUserMetaInfo({ username: (userData as User).username });
	}

	@Put('meta')
	@ApiTags('Users')
	async updateUserMetaInfo(
		@Request() req,
		@UserData() userData,
		@Body('metaInfo') metaInfo: Partial<UserMetaInformationI>,
	) {
		if (!userData) throw new UnauthorizedException();
		const requestedUser = userData as User;

		const validMetaObject = {
			theme: metaInfo.theme,
			pushStatus: metaInfo.pushStatus,
			contactVisibility: metaInfo.contactVisibility,
			prefferedCommunication: metaInfo.prefferedCommunication,
		};
		if (validMetaObject.theme !== 'light' && validMetaObject.theme !== 'dark') delete validMetaObject.theme;
		if (typeof validMetaObject.pushStatus !== 'boolean') delete validMetaObject.pushStatus;
		if (typeof validMetaObject.contactVisibility !== 'boolean') delete validMetaObject.contactVisibility;
		if (
			validMetaObject.prefferedCommunication !== 'email' &&
			validMetaObject.prefferedCommunication !== 'tel' &&
			validMetaObject.prefferedCommunication !== 'service'
		)
			delete validMetaObject.prefferedCommunication;

		return await this.usersService.updateMetaInformation({
			ident: { username: requestedUser.username },
			metaInfo: validMetaObject,
		});
	}

	@ApiTags('Users - Export')
	@SystemRoles(['admin', 'developer'])
	@Post('sheets/pages')
	@Header('Content-Disposition', 'attachment; filename="UsersPagesHistoryExport.xlsx"')
	async downloadUsersPagesHistoryExcel(
		@Request() req,
		@UserData() userData,
		@Body('usernames') usernames: string[],
	): Promise<StreamableFile> {
		if (!userData) throw new UnauthorizedException();
		if (!usernames || !usernames.length) throw new NotValidDataError();
		return this.usersExportService.downloadHistoryExcel(usernames, 'pages');
	}

	@ApiTags('Users - Export')
	@SystemRoles(['admin', 'developer'])
	@Post('sheets/requests')
	@Header('Content-Disposition', 'attachment; filename="UsersRequestsHistoryExport.xlsx"')
	async downloadUsersRequestsHistoryExcel(
		@Request() req,
		@UserData() userData,
		@Body('usernames') usernames: string[],
	): Promise<StreamableFile> {
		if (!userData) throw new UnauthorizedException();
		if (!usernames || !usernames.length) throw new NotValidDataError();
		return this.usersExportService.downloadHistoryExcel(usernames, 'requests');
	}

	@ApiTags('Users - Export')
	@SystemRoles('developer')
	@Post('sheets')
	@Header('Content-Disposition', 'attachment; filename="UsersExport.xlsx"')
	async downloadUsersExcel(
		@Request() req,
		@UserData() userData,
		@Body('createdAt') createdAt?: boolean,
		@Body('lastLoginIn') lastLoginIn?: boolean,
		@Body('lastModified') lastModified?: boolean,
		@Body('isActive') isActive?: boolean,
		@Body('isBlocked') isBlocked?: boolean,
		@Body('blockReason') blockReason?: boolean,
	): Promise<StreamableFile> {
		if (!userData) throw new UnauthorizedException();
		return this.usersExportService.downloadUsersExcel(userData as User, {
			createdAt,
			lastLoginIn,
			lastModified,
			isActive,
			isBlocked,
			blockReason,
		});
	}

	@ApiTags('Users - Export')
	@SystemRoles(['admin', 'developer'])
	@Post('sheets/accounts')
	@Header('Content-Disposition', 'attachment; filename="ExactUsersExport.xlsx"')
	async downloadExactUsersExcel(
		@Request() req,
		@UserData() userData,
		@Body('usernames') usernames: string[],
		@Body('createdAt') createdAt?: boolean,
		@Body('lastLoginIn') lastLoginIn?: boolean,
		@Body('lastModified') lastModified?: boolean,
		@Body('isActive') isActive?: boolean,
		@Body('isBlocked') isBlocked?: boolean,
		@Body('blockReason') blockReason?: boolean,
	): Promise<StreamableFile> {
		if (!userData) throw new UnauthorizedException();
		if (!usernames?.length) throw new NotValidDataError();
		if (usernames.length > 500)
			throw new NotValidDataError('Запрещено экспортировать данные более 500 пользователей за один запрос!');
		return this.usersExportService.downloadExactUsersExcel(usernames, userData as User, {
			createdAt,
			lastLoginIn,
			lastModified,
			isActive,
			isBlocked,
			blockReason,
		});
	}

	@ApiTags('Users - Export')
	@SystemRoles(['admin', 'developer'])
	@Post('sheets/accounts/global-group/:ggid')
	@Header('Content-Disposition', 'attachment; filename="UsersFromGlobalGroupExport.xlsx"')
	async downloadUsersFromGlobalGroupExcel(
		@Request() req,
		@UserData() userData,
		@Param('ggid', StringValidationPipe) ggid: string,
		@Body('createdAt') createdAt?: boolean,
		@Body('lastLoginIn') lastLoginIn?: boolean,
		@Body('lastModified') lastModified?: boolean,
		@Body('isActive') isActive?: boolean,
		@Body('isBlocked') isBlocked?: boolean,
		@Body('blockReason') blockReason?: boolean,
	): Promise<StreamableFile> {
		if (!userData) throw new UnauthorizedException();
		return this.usersExportService.downloadUsersFromGlobalGroupExcel(ggid, userData as User, {
			createdAt,
			lastLoginIn,
			lastModified,
			isActive,
			isBlocked,
			blockReason,
		});
	}

	@SystemRoles(['developer', 'admin'])
	@Post('delete')
	@ApiTags('Users')
	async deleteUsers(
		@UserData() userData,
		@Query('_id') _id: mongoose.Types.ObjectId,
		@Body('usernames') usernames: string[],
	) {
		if (!userData) throw new UnauthorizedException();
		if (!usernames || !usernames.length) throw new NotValidDataError();

		for (const username of usernames) {
			const requestedUserData = await this.usersService.findUser({ username, secret: true });
			if (!requestedUserData) throw new NotValidDataError();
			if (
				SystemRolesOptions[requestedUserData.__systemRole].accessLevel >
					SystemRolesOptions[(userData as User).__systemRole].accessLevel &&
				(userData as User).__systemRole !== 'superuser'
			)
				throw new UnauthorizedException(
					'У вас недостаточно прав для выполнения этого действия над одним из выбранных пользователей!',
				);
		}

		for (const username of usernames) {
			if (username === (userData as User).username) continue;
			await this.usersService.deleteUser(username, userData as User);
		}
		return { result: true };
	}
}
