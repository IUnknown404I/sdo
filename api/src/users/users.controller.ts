import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseBoolPipe,
	Post,
	Put,
	Query,
	Redirect,
	Request,
	Response,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StringOrUndefinedValidationPipe } from 'globalPipes/StringOrUndefinedValidationPipe';
import { ErrorMessages } from 'guards';
import { FingerprintsGuard } from 'guards/FingerprintsGuard';
import { RefreshOrAccessTokenGuard } from 'guards/RefreshOrAccessTokenGuard';
import mongoose from 'mongoose';
import { expiredCookiesConfig } from 'utils/cookiesConfig';
import { NotValidDataError } from '../../errors/NotValidDataError';
import { EmailValidationPipe } from '../../globalPipes/EmailValidationPipe';
import { PasswordValidationPipe } from '../../globalPipes/PasswordValidationPipe';
import { StringValidationPipe } from '../../globalPipes/StringValidationPipe';
import { UsernameValidationPipe } from '../../globalPipes/UsernameValidationPipes';
import { AccessTokenGuard } from '../../guards/AccessTokenGuard';
import { AuthService } from '../auth/auth.service';
import { AccessTokenPayload, User, UserMetaInformationI, UserPersonalT } from './users.schema';
import { PublicUserData, UsersService } from './users.service';

export const RESERVED_USERNAMES = [
	'system',
	'info',
	'notification',
	'notifications',
	'admin',
	'superuser',
	'root',
	'host',
	'observe',
] as const;

@Controller('users')
export class UsersController {
	constructor(
		// @Inject(forwardRef(() => AuthService))
		readonly usersService: UsersService,
		readonly authService: AuthService,
	) {}

	@Post('')
	@ApiTags('Users')
	async registration(
		@Request() req,
		@Body('username', UsernameValidationPipe) username: string,
		@Body('password', PasswordValidationPipe) password: string,
		@Body('email', EmailValidationPipe) email: string,
		@Body('company') company?: string,
		@Query('activatedUser') activatedUser?: boolean,
	) {
		// reservation check
		if (RESERVED_USERNAMES.includes(username as (typeof RESERVED_USERNAMES)[number]))
			throw new NotValidDataError('Данный логин зарезервирован системой! Укажите другой.');

		let resultOfCreatingUser: any = false;
		const accessToken: string | undefined = req.headers.authorization?.split(' ')[1];

		if (!!activatedUser === true && accessToken)
			resultOfCreatingUser = await this.usersService.createOne({
				username,
				password,
				email,
				company,
				activatedUser,
			});
		else if (!!activatedUser === true && !accessToken) throw new UnauthorizedException(ErrorMessages.ACCESS_ERROR);
		else
			resultOfCreatingUser = await this.usersService.createOne({
				username,
				password,
				email,
				company,
			});

		return !!resultOfCreatingUser;
	}

	@UseGuards(AccessTokenGuard)
	@Get('')
	@ApiTags('Users')
	async getUser(
		@Query('_id') _id: mongoose.Types.ObjectId,
		@Query('username', UsernameValidationPipe) username: string,
	): Promise<User | PublicUserData> {
		if (!_id && !username) throw new NotValidDataError();
		return await this.usersService.findUser({ _id, username });
	}

	@UseGuards(AccessTokenGuard)
	@Delete('')
	@ApiTags('Users')
	async deleteUser(
		@Query('_id') _id: mongoose.Types.ObjectId,
		@Query('username', UsernameValidationPipe) username: string,
	) {
		throw new UnauthorizedException();
	}

	@UseGuards(AccessTokenGuard)
	@Get('all')
	@ApiTags('Users')
	async getAll(): Promise<PublicUserData[]> {
		return await this.usersService.findAll();
	}

	@UseGuards(AccessTokenGuard)
	@Get('hash')
	@ApiTags('Users')
	async hash(@Query('payload', StringValidationPipe) payload: string) {
		return await this.usersService.hashData(payload);
	}

	@UseGuards(AccessTokenGuard)
	@Put('block')
	@ApiTags('Users')
	async blockUser(
		@Body('username', UsernameValidationPipe) username: string,
		@Body('isBlocked', ParseBoolPipe) isBlocked: boolean,
		@Body('reason') reason?: string,
	) {
		if (isBlocked) return await this.usersService.blockUser({ username, reason });
		else return await this.usersService.unBlockUser({ username });
	}

	@Get('/validate/:token')
	@ApiTags('Users')
	@Redirect()
	async validateEmailToken(@Param() params, @Response() res) {
		try {
			const result: false | User = await this.usersService.validateEmailToken(params.token);
			if (result && result.username) return res.redirect('https://sdo.rnprog.ru/login?source=validation');
			else return res.redirect('https://sdo.rnprog.ru/registration/error');
		} catch (e) {
			return res.redirect('https://sdo.rnprog.ru/registration/error'); //no token or no user with the token
		}
	}

	@UseGuards(RefreshOrAccessTokenGuard, FingerprintsGuard)
	@Put('logout')
	@ApiTags('Users')
	async logoutUser(@Response() res, @Request() req, @Body('username', UsernameValidationPipe) username: string) {
		const user = await this.usersService.findUser({ username });
		if (!user) throw new NotValidDataError();

		let usernameFromToken = '';
		if (req.headers?.authorization)
			usernameFromToken = (
				(await this.usersService.decodeJWT(req.headers.authorization.split(' ')[1])) as AccessTokenPayload
			)?.username;
		else usernameFromToken = (await this.usersService.findByRefreshToken(req.cookies.refreshToken))?.username;
		if (user.username !== usernameFromToken)
			throw new UnauthorizedException('Ошибка авторизации запрошенной операции!');

		await this.usersService.logoutUser(user);
		res.cookie('refreshToken', '', expiredCookiesConfig);
		res.status(200).send('See you again!');
	}

	@Get('recovery-token-validate')
	@ApiTags('Users')
	async recoveryTokenValidate(@Query('token', StringValidationPipe) token: string): Promise<boolean> {
		const searchResult = await this.usersService.findUserByRecoveryToken(token, true);
		if (!!searchResult == null) throw new NotValidDataError();
		// check for one hour delta max
		const createdDateArr: string[] = searchResult[0].lastPasswordRequest.split(' ');
		const createdValidDate: string = `${createdDateArr[0].split('.')[2]}-${createdDateArr[0].split('.')[1]}-${
			createdDateArr[0].split('.')[0]
		}`;

		const requestedUserValidFullDate = new Date(createdValidDate).setHours(
			parseInt(createdDateArr[1].split(':')[0]),
			parseInt(createdDateArr[1].split(':')[1].slice(0, 2)),
			parseInt(createdDateArr[1].split('.')[1]),
		);
		if (Math.abs(requestedUserValidFullDate - new Date().setHours(new Date().getHours())) > 1000 * 60 * 60 * 1) {
			this.usersService.updateRecoveryTokenValue({ username: searchResult[0].username, newToken: '' });
			throw new NotValidDataError('Заявка на смену пароля просрочена (дается 1 час)!');
		}

		return !(!searchResult || searchResult.length !== 1);
	}

	@Post('recovery')
	@ApiTags('Users')
	async passRecovery(
		@Body('username', UsernameValidationPipe) username: string,
		@Body('email', EmailValidationPipe) email: string,
	): Promise<boolean> {
		return !!(await this.usersService.recoveryActions(username, email, true));
	}

	@Redirect()
	@Get('recovery/:token')
	@ApiTags('Users')
	async recoveryTokenValidation(@Response() res, @Param() params, @Query('request') request?: string) {
		const searchResult = await this.usersService.findUserByRecoveryToken(params.token, true);
		if (!searchResult || searchResult.length !== 1) return res.redirect('https://sdo.rnprog.ru/recovery/error');
		else
			return res.redirect(
				`https://sdo.rnprog.ru/recovery/password-rewrite?token=${params.token}${
					request ? `&request=${request}` : ''
				}`,
			);
	}

	@Put('recovery/password')
	@ApiTags('Users')
	async passUpdateAfterRecovery(
		@Body('token', StringValidationPipe) token: string,
		@Body('newPassword', PasswordValidationPipe) newPassword: string,
	): Promise<boolean> {
		return await this.usersService.recoveryUpdate(token, newPassword);
	}

	@Put('leave-meta')
	@ApiTags('Users')
	@UseGuards(RefreshOrAccessTokenGuard, FingerprintsGuard)
	async onLeaveDataUpdate(@Request() req, @Body('lastPage', StringValidationPipe) lastPage: string) {
		let username = '';
		if (req.headers?.authorization)
			username = (
				(await this.usersService.decodeJWT(req.headers.authorization.split(' ')[1])) as AccessTokenPayload
			)?.username;
		else username = (await this.usersService.findByRefreshToken(req.cookies.refreshToken)).username;

		if (username == null) throw new NotValidDataError();
		return await this.usersService.onLeaveDataUpdate({ username, lastPage });
	}

	@Get('personal')
	@ApiTags('Users')
	@UseGuards(AccessTokenGuard)
	async getPersonalUserData(@Request() req) {
		if (!req.headers.authorization) throw new UnauthorizedException();
		const decodedTokenData: AccessTokenPayload = (await this.usersService.decodeJWT(
			req.headers.authorization.split(' ')[1],
		)) as AccessTokenPayload;
		return await this.usersService.getUserPersonalData({ username: decodedTokenData.username });
	}

	@Put('personal')
	@ApiTags('Users')
	@UseGuards(AccessTokenGuard)
	async updatePersonalUserdata(
		@Request() req,
		@Body('name', StringValidationPipe) name: string,
		@Body('surname', StringValidationPipe) surname: string,
		@Body('city', StringOrUndefinedValidationPipe) city?: string,
		@Body('company', StringOrUndefinedValidationPipe) company?: string,
		@Body('position', StringOrUndefinedValidationPipe) position?: string,
		@Body('tel', StringOrUndefinedValidationPipe) tel?: string,
		@Body('avatar', StringOrUndefinedValidationPipe) avatar?: string,
	) {
		const decodedTokenData: AccessTokenPayload = (await this.usersService.decodeJWT(
			req.headers.authorization?.split(' ')[1],
		)) as AccessTokenPayload;
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
			ident: { username: decodedTokenData.username },
			personal: parsedObject,
		});
	}

	@Put('personal/email')
	@ApiTags('Users')
	@UseGuards(AccessTokenGuard)
	async emailChange(
		@Request() req,
		@Body('email', StringValidationPipe) email: string,
		@Body('password', StringValidationPipe) password: string,
	) {
		const decodedTokenData: AccessTokenPayload = (await this.usersService.decodeJWT(
			req.headers.authorization?.split(' ')[1],
		)) as AccessTokenPayload;
		const userValidateFlag = await this.usersService.validateUser({
			username: decodedTokenData.username,
			password,
		});
		if (!userValidateFlag) throw new UnauthorizedException();
		this.usersService.updateLastEmailUpdateRequest({ username: decodedTokenData.username });

		// email comparisson with other users
		if (decodedTokenData.email === email)
			throw new NotValidDataError('Данная почта уже привязана к учетной записи! Укажите другую.');

		if ((await this.usersService.findUserByEmail(email, true))?.username != null)
			throw new NotValidDataError('Данная почта уже используется в системе! Укажите другую.');

		// generate and set the email token + writing requested email address and send verification email
		const newEmailToken = await this.usersService.createEmailToken();
		this.usersService.updateRequestedEmailUser({ username: decodedTokenData.username, requestedEmail: email });
		this.usersService.updateRequestedEmailToken({ username: decodedTokenData.username, token: newEmailToken });
		return await this.usersService.sendEmailChangeRequest({
			oldEmail: decodedTokenData.email,
			newEmail: email,
			verificationLink: newEmailToken,
		});
	}

	@Get('personal/email/validation/:token')
	@ApiTags('Users')
	@Redirect()
	async newEmailTokenValidation(@Param() params, @Response() res) {
		try {
			const result: false | User = await this.usersService.validateEmailToken(params.token, false, 1);
			if (result && result.username) {
				res.cookie('refreshToken', '', expiredCookiesConfig);
				return res.redirect('https://sdo.rnprog.ru?source=replacement');
			} else return res.redirect('https://sdo.rnprog.ru/replacement/error');
		} catch (e) {
			return res.redirect('https://sdo.rnprog.ru/replacement/error'); //no token or no user with the token
		}
	}

	@Put('personal/password')
	@ApiTags('Users')
	@UseGuards(AccessTokenGuard)
	async passwordChange(@Request() req, @Body('password', StringValidationPipe) password: string) {
		const decodedTokenData: AccessTokenPayload = (await this.usersService.decodeJWT(
			req.headers.authorization?.split(' ')[1],
		)) as AccessTokenPayload;
		const userValidateFlag = await this.usersService.validateUser({
			username: decodedTokenData.username,
			password,
		});
		if (!userValidateFlag) throw new UnauthorizedException();
		this.usersService.updatePasswordRequestDate({ username: decodedTokenData.username });

		const newRecoveryToken = await this.usersService.createRecoveryToken();
		this.usersService.updateRecoveryTokenValue({ username: decodedTokenData.username, newToken: newRecoveryToken });
		return await this.usersService.sendPasswordChangeRequest({
			email: decodedTokenData.email,
			recoveryLink: newRecoveryToken + '?request=change',
		});
	}

	@Get('meta')
	@ApiTags('Users')
	@UseGuards(AccessTokenGuard)
	async getUserMetaInfo(@Request() req) {
		const decodedTokenData: AccessTokenPayload = (await this.usersService.decodeJWT(
			req.headers.authorization?.split(' ')[1],
		)) as AccessTokenPayload;
		return await this.usersService.getUserMetaInfo({ username: decodedTokenData.username });
	}

	@Put('meta')
	@ApiTags('Users')
	@UseGuards(AccessTokenGuard)
	async updateUserMetaInfo(@Request() req, @Body('metaInfo') metaInfo: Partial<UserMetaInformationI>) {
		const decodedTokenData: AccessTokenPayload = (await this.usersService.decodeJWT(
			req.headers.authorization?.split(' ')[1],
		)) as AccessTokenPayload;

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
			ident: { username: decodedTokenData.username },
			metaInfo: validMetaObject,
		});
	}
}
