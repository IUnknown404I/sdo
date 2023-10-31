import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { ErrorMessages } from 'guards';
import mongoose, { Model } from 'mongoose';
import EmailChangeTemplate from 'src/email/templates/emailChangeTemplate';
import PasswordChangeTemplate from 'src/email/templates/passwordChangeTemplate';
import { uid } from 'uid';
import logapp from 'utils/logapp';
import { NotValidDataError } from '../../errors/NotValidDataError';
import {
	getToday,
	twoDatesCompare,
	twoOnyxDatesDifferenceInHours,
	twoOnyxDatesDifferenceInMinutes,
} from '../../utils/date-utils';
import EmailVerificationTemplate from '../email/templates/emailVerificationTemplate';
import PasswordRecoveryTemplate from '../email/templates/passwordRecoveryTemplate';
import { User, UserFriendsI, UserI, UserMetaInformationI, UserPersonalT, UsersDocument } from './users.schema';

export interface UserIdentPayload {
	_id?: string | mongoose.Types.ObjectId;
	username?: string;
	secret?: boolean;
}
export interface UserIdentWithEmailPayload extends UserIdentPayload {
	email?: string;
}

export interface PublicUserData
	extends Omit<UserI, 'password' | 'activeRefreshToken' | 'recoveryToken' | 'failedAttempts'> {}

export const secretHidingObj = {
	_id: 0,
	__v: 0,
	password: 0,
	emailToken: 0,
	recoveryToken: 0,
	activeRefreshToken: 0,
	failedAttempts: 0,
	_requestedEmail: 0,
	_requestedEmailToken: 0,
	lastAuthRequest: 0,
	lastEmailRequest: 0,
	lastPasswordRequest: 0,
	lastEmailUpdateRequest: 0,
	lastPages: 0,
};

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name, 'onyxDB') private usersModel: Model<UsersDocument>,
		private jwtService: JwtService,
		private readonly mailerService: MailerService,
	) {}

	async findUser(payload: UserIdentPayload): Promise<User | PublicUserData> {
		if (!payload._id && !payload.username) throw new NotValidDataError();
		return await this.usersModel
			.findOne(
				payload._id ? { _id: payload._id } : { username: payload.username },
				payload.secret ? {} : secretHidingObj,
			)
			.exec();
	}

	async findUserByEmail(email: string, secret: boolean = false): Promise<User | PublicUserData> {
		if (!email) throw new NotValidDataError();
		return await this.usersModel
			.findOne(
				{ email },
				secret
					? {}
					: {
							_id: 0,
							__v: 0,
							password: 0,
							activeRefreshToken: 0,
							recoveryToken: 0,
							failedAttempts: 0,
					  },
			)
			.exec();
	}

	async findAll(): Promise<PublicUserData[]> {
		return await this.usersModel
			.find({}, { _id: 0, __v: 0, password: 0, activeRefreshToken: 0, failedAttempts: 0 })
			.exec();
	}

	async findAllByUSernameOrEmail(props: { email?: string; username?: string }): Promise<UserI[]> {
		if (!props.email && !props.username) throw new NotValidDataError();

		const searhObject = { ...props };
		if (!props.email) delete searhObject.email;
		else if (!props.username) delete searhObject.username;

		return await this.usersModel.find(searhObject, secretHidingObj).exec();
	}

	// searhing by regex
	async findAllEqualsByUSernameOrEmail(props: { email?: string; username?: string }): Promise<UserI[]> {
		if (!props.email && !props.username) throw new NotValidDataError();

		const searhObject = {
			email: { $regex: props.email, $options: 'i' },
			username: { $regex: props.username, $options: 'i' },
		};
		if (!props.email) delete searhObject.email;
		else if (!props.username) delete searhObject.username;

		return await this.usersModel.find(searhObject, secretHidingObj).exec();
	}

	async findByRefreshToken(refreshToken: string): Promise<User & { _id: string }> {
		const tokenData = this.jwtService.decode(refreshToken);

		if (!tokenData) throw new NotValidDataError();
		if (typeof tokenData === 'string' || !('userID' in tokenData))
			throw new NotValidDataError('Incorrect token provided!');

		return await this.usersModel.findById(tokenData.userID, {}).exec();
	}

	/**
	 * @IUnknown404I this function validates user data: user existance, blocked or inactive states, password validation if passed.
	 * @param payload user identics and password optional. If password passed will check validity corresponding to decoded user's one.
	 * @returns userDTO as UserI if all is OK and false is one of checkes fails.
	 */
	async validateUser(payload: {
		user?: User & { _id: string; __v: string };
		username?: string;
		password?: string;
		email?: string;
	}): Promise<(User & { _id: string; __v: string }) | false> {
		if (
			(!payload.user || !payload.user._id) &&
			(!payload.username || payload.username === 'DisabledValue*0') &&
			(!payload.email || payload.email === 'Disable@dis.no')
		)
			throw new NotValidDataError();

		const exactUser =
			payload.user || payload.username
				? ((await this.findUser({
						username: payload.user && payload.user?.username ? payload.user.username : payload.username,
						secret: true,
				  })) as User & { _id: string; __v: string })
				: ((await this.usersModel.findOne(
						{
							email: payload!.email,
							emailToken: 'verificated',
						},
						{},
				  )) as User & { _id: string; __v: string });

		// if blocked for 5 failed attemts (1 ban-hour fixed) check for the hour already passed.
		// ->> clear attempts and unBlock the account
		if (
			exactUser.isBlocked === true &&
			exactUser.failedAttempts >= 5 &&
			(exactUser.blockReason === 'Блокировка в связи с подозрительной активностью пользователя.' ||
				exactUser.blockReason === 'Блокировка в связи с подозрительным поведением пользователя.') &&
			Math.abs(twoOnyxDatesDifferenceInHours(exactUser.lastAuthRequest)) >= 1
		) {
			await this.clearFailedAttempts(exactUser);
			await this.unBlockUser({ username: exactUser.username });
			// if user has failed attempts but more then 1h ago and he is not blocked ->> clear attempts
		} else if (
			!!!exactUser.isBlocked &&
			!!!exactUser.blockReason &&
			exactUser.failedAttempts > 0 &&
			exactUser.failedAttempts < 5 &&
			Math.abs(twoOnyxDatesDifferenceInHours(exactUser.lastAuthRequest)) >= 1
		)
			await this.clearFailedAttempts(exactUser);

		if (exactUser.isActive === false)
			throw new UnauthorizedException(
				'Ваша учетная запись не активирована! Проверьте Вашу почту или обратитесь в техническую поддержку.',
			);

		if (exactUser.isBlocked === true) {
			const banMinutesLeft = 60 - Math.abs(Math.ceil(twoOnyxDatesDifferenceInMinutes(exactUser.lastAuthRequest)));
			const outOfAttemtsBanTiming =
				exactUser.blockReason === 'Блокировка в связи с подозрительной активностью пользователя.'
					? ` Сможете попробовать снова через ${banMinutesLeft > 0 ? banMinutesLeft : 'меньше 1'} мин.`
					: '';
			throw new UnauthorizedException(
				`Ваша учетная запись заблокирована! Причина блокировки: ${
					exactUser.blockReason.endsWith('.') ? exactUser.blockReason.slice(0, -1) : exactUser.blockReason
				}.` + outOfAttemtsBanTiming,
			);
		}

		this.updateAuthRequestDate({ userIdent: exactUser });
		return payload.password
			? (await this.comparePasswords({
					user: exactUser,
					password: payload.password,
			  }))
				? exactUser
				: false
			: exactUser;
	}

	async comparePasswords(payload: { user?: User; username?: string; password: string }): Promise<boolean> {
		if (!payload.user && !payload.username) throw new UnauthorizedException(ErrorMessages.AUTH_ERROR);

		const userData =
			payload.user ||
			(await this.usersModel
				.findOne({ username: payload.username || payload.user.username }, { password: 1 })
				.exec());
		if (!userData || !userData.password) throw new UnauthorizedException(ErrorMessages.AUTH_ERROR);
		return (await payload.password) === userData.password || bcrypt.compare(payload.password, userData.password);
	}

	async hashData(data: string): Promise<string> {
		return await bcrypt.hash(data, 12);
	}

	async incFailedAttempts(payload: UserIdentPayload) {
		if (!payload._id && !payload.username) throw new NotValidDataError();
		return await this.usersModel
			.updateOne(payload._id ? { _id: payload._id } : { username: payload.username }, {
				$inc: { failedAttempts: 1 },
			})
			.exec();
	}

	async clearFailedAttempts(payload: UserIdentPayload) {
		if (!payload._id && !payload.username) throw new NotValidDataError();
		return await this.usersModel
			.updateOne(payload._id ? { _id: payload._id } : { username: payload.username }, { failedAttempts: 0 })
			.exec();
	}

	async blockUser(payload: UserIdentPayload & { reason?: string }) {
		if (!payload._id && !payload.username) throw new NotValidDataError();
		return await this.usersModel
			.updateOne(payload._id ? { _id: payload._id } : { username: payload.username }, {
				isBlocked: true,
				blockReason: payload.reason || 'Блокировка в связи с подозрительной активностью пользователя.',
			})
			.exec();
	}

	async unBlockUser(payload: UserIdentPayload) {
		if (!payload._id && !payload.username) throw new NotValidDataError();
		return await this.usersModel
			.updateOne(payload._id ? { _id: payload._id } : { username: payload.username }, {
				isBlocked: false,
				blockReason: '',
			})
			.exec();
	}

	async updateLastLoginInDate(payload: UserIdentPayload & { newValue: string }) {
		if ((!payload._id && !payload.username) || !payload.newValue) throw new NotValidDataError();
		return await this.usersModel
			.updateOne(payload._id ? { _id: payload._id } : { username: payload.username }, {
				lastLoginIn: payload.newValue,
			})
			.exec();
	}

	async updateLastModifiedDate(payload: UserIdentPayload & { newValue?: string }) {
		if (!payload._id && !payload.username) throw new NotValidDataError();
		const today = getToday();
		return await this.usersModel
			.updateOne(payload._id ? { _id: payload._id } : { username: payload.username }, {
				lastModified: payload.newValue || `${today.today} ${today.time}`,
			})
			.exec();
	}

	async updateActiveRefreshToken(payload: UserIdentPayload & { newToken: string }) {
		if ((!payload._id && !payload.username) || !payload.newToken) throw new NotValidDataError();
		return await this.usersModel
			.updateOne(payload._id ? { _id: payload._id } : { username: payload.username }, {
				activeRefreshToken: payload.newToken,
			})
			.exec();
	}

	async updateRecoveryTokenValue(payload: UserIdentPayload & { newToken: string }) {
		const today = getToday();
		if ((!payload._id && !payload.username) || (!payload.newToken && payload.newToken === undefined))
			throw new NotValidDataError();
		return await this.usersModel
			.updateOne(payload._id ? { _id: payload._id } : { username: payload.username }, {
				recoveryToken: payload.newToken,
				lastModified: `${today.today} ${today.time}`,
			})
			.exec();
	}

	async createOne(props: {
		username: string;
		password: string;
		email: string;
		company?: string;
		activatedUser?: boolean;
	}) {
		const existsCheck = await this.findUser({ username: props.username });
		const emailExistsCheck = await this.usersModel.findOne({
			$and: [{ email: props.email }, { emailToken: 'verificated' }],
		});
		if (existsCheck) throw new UnauthorizedException('Такой пользователь уже существует!');
		if (emailExistsCheck) throw new UnauthorizedException('Эта почта уже привязана к другому аккаунту!');

		const today = getToday();
		const emailToken = await this.createEmailToken();
		const userDTO: User = {
			...props,
			password: await this.hashData(props.password),
			emailToken,
			personal: {
				name: props.username,
				surname: 'Пользователь',
				company: props.company ? props.company : '',
			},
			metaInfo: { theme: 'light', contactVisibility: true, pushStatus: true, prefferedCommunication: 'email' },
			recoveryToken: 'none',
			isActive: !!props.activatedUser,
			isBlocked: false,
			blockReason: '',
			createdAt: `${today.today} ${today.time}`,
			lastModified: `${today.today} ${today.time}`,
			lastLoginIn: 'never',
			lastAuthRequest: 'never',
			lastEmailRequest: 'never',
			lastEmailUpdateRequest: 'never',
			_requestedEmail: '',
			_requestedEmailToken: '',
			lastPasswordRequest: 'never',
			activeRefreshToken: 'none',
			failedAttempts: 0,
			lastFingerprints: '',
			lastPages: {
				length: 0,
				logs: {},
			},
			lastRequests: {
				length: 0,
				logs: {},
			},
			chats: {
				public: ['general', 'help', 'notifications'],
				group: [],
				private: [],
			},
			friends: {
				accepted: [],
				pending: [],
				requested: [],
			},
		};
		if ((userDTO as Object).hasOwnProperty('activatedUser')) delete userDTO['activatedUser'];
		if ((userDTO as Object).hasOwnProperty('company')) delete userDTO['company'];

		if (!!props.activatedUser === false)
			this.sendEmailVerification({
				username: props.username,
				email: props.email,
				token: emailToken,
				createdAt: `${today.today} ${today.time}`,
			});
		return await this.usersModel.create(userDTO);
	}

	async validateEmailToken(
		token: string,
		ignoreStatusChange: boolean = false,
		timeoutInHours: number = 72,
	): Promise<false | User> {
		const today = getToday();
		const requestedUser: User = await this.usersModel.findOne(
			{ $or: [{ emailToken: token }, { _requestedEmailToken: token }] },
			{},
		);

		if (!requestedUser || !requestedUser.email) throw new NotValidDataError();
		const emailCheckArray: User[] = await this.usersModel.find(
			{
				email: requestedUser.email,
				emailToken: 'verificated',
			},
			{},
		);

		if (emailCheckArray.length !== 0)
			throw new UnauthorizedException('Эта почта уже привязана к другому аккаунту!');
		else if (requestedUser && requestedUser.username) {
			const isEmailChangeRequested = !!requestedUser._requestedEmail || !!requestedUser._requestedEmailToken;
			await this.activateUser({ username: requestedUser.username });
			if (!ignoreStatusChange)
				await this.usersModel.updateOne({ username: requestedUser.username }, { emailToken: 'verificated' });

			const createdDateArr: string[] = requestedUser.createdAt.split(' ');
			const createdValidDate: string = `${createdDateArr[0].split('.')[2]}-${createdDateArr[0].split('.')[1]}-${
				createdDateArr[0].split('.')[0]
			}`;
			const requestedUserValidFullDate = new Date(createdValidDate).setHours(
				parseInt(createdDateArr[1].split(':')[0], parseInt(createdDateArr[1].split(':')[1].slice(0, 2))),
				parseInt(createdDateArr[1].split('.')[1]),
			);

			if (
				Math.abs(requestedUserValidFullDate - new Date().setHours(new Date().getHours())) >
				1000 * 60 * 60 * (isEmailChangeRequested ? 1 : timeoutInHours)
			) {
				if (isEmailChangeRequested) {
					this.updateRequestedEmailUser({ username: requestedUser.username, requestedEmail: '' });
					this.updateRequestedEmailToken({ username: requestedUser.username, token: '' });
					throw new NotValidDataError('Запрос на смену электронной почты просрочен.');
				} else {
					this.updateEmailToken({ username: requestedUser.username, emailToken: '' });
					await this.blockUser({
						username: requestedUser.username,
						reason: 'Активация учетной записи произошла по истечении срока активации.',
					});
				}
			} else {
				await this.usersModel.updateOne(
					{ username: requestedUser.username },
					{
						isActive: true,
						lastLoginIn: `${today.today} ${today.time}`,
					},
				);
			}
			return requestedUser;
		} else return false;
	}

	async sendEmailVerification(props: { username: string; email: string; token: string; createdAt: string }) {
		return await this.mailerService
			.sendMail({
				to: [props.email.trim()],
				from: process.env.MAIL_USER_FULL,
				subject: `[Подтверждение аккаунта] Активируйте созданную учетную запись на образовательной платформе!`,
				text: 'Подтверждение аккаунта',
				html: EmailVerificationTemplate({
					email: props.email.trim(),
					datetime: `${props.createdAt.split(' ')[1]} ${props.createdAt.split(' ')[0]}`,
					verificationLink: props.token,
				}),
			})
			.then(res => res)
			.catch(err => err);
	}

	async sendEmailRecovery(props: { email: string; token: string }) {
		const today = getToday();
		return await this.mailerService
			.sendMail({
				to: [props.email.trim()],
				from: process.env.MAIL_USER_FULL,
				subject: `[Восстановление доступа] Подтвердите перезапись Вашего текущего пароля!`,
				text: 'Восстановление доступа к аккаунту',
				html: PasswordRecoveryTemplate({
					datetime: `${today.time} ${today.today}`,
					recoveryLink: props.token,
				}),
			})
			.then(res => res)
			.catch(err => err);
	}

	async sendEmailChangeRequest(props: { oldEmail: string; newEmail: string; verificationLink: string }) {
		const today = getToday();
		return await this.mailerService
			.sendMail({
				to: [props.newEmail.trim()],
				from: process.env.MAIL_USER_FULL,
				subject: `[Изменение личных данных] Получен запрос на изменение почты.`,
				text: 'Вы отправили запрос на изменение электронной почты.',
				html: EmailChangeTemplate({
					date: `${today.time} ${today.today}`,
					oldEmail: props.oldEmail,
					newEmail: props.newEmail,
					verificationLink: props.verificationLink,
				}),
			})
			.then(res => res)
			.catch(err => err);
	}

	async sendPasswordChangeRequest(props: { email: string; recoveryLink: string }) {
		const today = getToday();
		return await this.mailerService
			.sendMail({
				to: [props.email.trim()],
				from: process.env.MAIL_USER_FULL,
				subject: `[Изменение личных данных] Получен запрос на изменение пароля.`,
				text: 'Вы отправили запрос на изменение пароля от аккаунта.',
				html: PasswordChangeTemplate({
					datetime: `${today.time} ${today.today}`,
					recoveryLink: props.recoveryLink,
				}),
			})
			.then(res => res)
			.catch(err => err);
	}

	async createEmailToken(): Promise<string> {
		return uid(64);
	}

	async createRecoveryToken(): Promise<string> {
		return uid(96);
	}

	async updateEmailToken(payload: UserIdentPayload & { emailToken: string }) {
		return await this.usersModel
			.updateOne(
				payload._id ? { _id: payload._id } : { username: payload.username },
				{ emailToken: payload.emailToken },
				{ projection: payload.secret ? {} : secretHidingObj },
			)
			.exec();
	}

	async activateUser(payload: UserIdentPayload) {
		return await this.usersModel
			.updateOne(
				payload._id ? { _id: payload._id } : { username: payload.username },
				{ isActive: false },
				{
					projection: payload.secret ? {} : secretHidingObj,
				},
			)
			.exec();
	}

	async disactivateUser(payload: UserIdentPayload) {
		return await this.usersModel
			.updateOne(
				payload._id ? { _id: payload._id } : { username: payload.username },
				{ isActive: true },
				{
					projection: payload.secret ? {} : secretHidingObj,
				},
			)
			.exec();
	}

	async findUserByRecoveryToken(token: string, secret: boolean = false): Promise<User[]> {
		if (!token) throw new NotValidDataError();
		return await this.usersModel
			.find(
				{ recoveryToken: token },
				secret
					? {}
					: {
							_id: 0,
							__v: 0,
							password: 0,
							activeRefreshToken: 0,
							failedAttempts: 0,
							recoveryToken: 0,
					  },
			)
			.exec();
	}

	async recoveryActions(username: string, email: string, secret: boolean = false, forced: boolean = false) {
		const searchProps = { username, email };
		if ((!username || username === 'DisabledValue*0') && (!email || email === 'Disable@dis.no'))
			throw new NotValidDataError();
		if (!username || username === 'DisabledValue*0') delete searchProps.username;
		if (!email || email === 'Disable@dis.no') delete searchProps.email;

		const exactUser = await this.usersModel.findOne(
			searchProps,
			secret
				? {}
				: {
						_id: 0,
						__v: 0,
						password: 0,
						activeRefreshToken: 0,
						failedAttempts: 0,
						recoveryToken: 0,
				  },
		);

		if (!exactUser || !exactUser.username)
			throw new UnauthorizedException('Ошибка авторизации! Указаны неверные данные.');
		const datesDifference =
			exactUser.lastEmailRequest && Math.abs(twoOnyxDatesDifferenceInHours(exactUser.lastEmailRequest));
		if (datesDifference && datesDifference <= 0.25)
			throw new UnauthorizedException(
				`На Ваш аккаунт действует ограничение по email-рассылке! Поробуйте еще раз через ${
					6 - Math.ceil(datesDifference * 60)
				} мин.`,
			);

		await this.updateEmailRequestDate(exactUser);
		// throw new NotValidDataError('breakpoint for testing');
		const newRecoveryToken = await this.createRecoveryToken();
		this.sendEmailRecovery({ email, token: newRecoveryToken });
		return await this.updateRecoveryTokenValue({ username, newToken: newRecoveryToken, secret: true });
	}

	async recoveryUpdate(recoveryToken: string, newPassword: string): Promise<true> {
		if (!recoveryToken || !newPassword) throw new NotValidDataError();
		const searchResult: User[] = await this.findUserByRecoveryToken(recoveryToken, true);
		if (!searchResult || searchResult.length !== 1)
			throw new UnauthorizedException(
				'Предоставлен невалидный ключ восстановления! Сначала оформите заявку на восстановление доступа.',
			);
		if (await this.comparePasswords({ user: searchResult[0], password: newPassword }))
			throw new NotValidDataError('Этот пароль уже установлен! Укажите другой.');

		this.updateLastModifiedDate({ username: searchResult[0].username });
		await this.passChange({ recoveryToken, password: newPassword });
		await this.usersModel.updateOne({ username: searchResult[0].username }, { recoveryToken: 'none' }).exec();
		return true;
	}

	async passChange(props: { username?: string; recoveryToken?: string; password: string }) {
		if (!props.password || (!props.username && !props.recoveryToken)) throw new NotValidDataError();
		return await this.usersModel
			.updateOne(props.username ? { username: props.username } : { recoveryToken: props.recoveryToken }, {
				password: await this.hashData(props.password),
			})
			.exec();
	}

	async logoutUser(payload: UserIdentPayload | UserI) {
		const today = getToday();
		return await this.usersModel
			.updateOne(
				'_id' in payload ? { _id: payload._id } : { username: payload.username },
				{
					activeRefreshToken: 'none',
					lastModified: `${today.today} ${today.time}`,
				},
				{
					projection: 'secret' in payload ? {} : secretHidingObj,
				},
			)
			.exec();
	}

	/**
	 * @IUnknown404I updating logs of requested pages for the passed user.
	 * @param payload with username, lastPage as string "<date> <time> -> <address>".
	 * @returns mongoose update result.
	 */
	async onLeaveDataUpdate(payload: { username: string; lastPage: string; secret?: boolean }) {
		const userDTO = await this.usersModel.findOne({ username: payload.username }, {});
		if (!userDTO) return;
		const { today, time: currentTime } = getToday();

		// new users check
		if (!userDTO.lastPages.logs || Object.keys(userDTO.lastPages.logs).length === 0) {
			userDTO.lastPages.logs = { [today]: [`${currentTime} -> ${payload.lastPage}`] };
			userDTO.lastPages.length += 1;
		}

		// cases where length more than max-limit or object dosent exists
		if (userDTO.lastPages === undefined) userDTO.lastPages = { length: 0, logs: {} };
		else if (userDTO.lastPages.length >= 200) {
			const keys = Object.keys(userDTO.lastPages.logs);
			if (twoDatesCompare(keys.slice(-1)[0], keys.slice(0)[0])) {
				userDTO.lastPages.length -= userDTO.lastPages.logs[keys.slice(0)[0]].length;
				delete userDTO.lastPages.logs[keys.slice(0)[0]];
			} else {
				userDTO.lastPages.length -= userDTO.lastPages.logs[keys.slice(-1)[0]].length;
				delete userDTO.lastPages.logs[keys.slice(-1)[0]];
			}
		}

		// updating lastPages object with passed lastPage string
		if (today in userDTO.lastPages.logs) {
			userDTO.lastPages.logs[today].unshift(`${currentTime} -> ${payload.lastPage}`);
		} else {
			userDTO.lastPages.logs[today] = [`${currentTime} -> ${payload.lastPage}`];
		}
		userDTO.lastPages.length += 1;

		return await this.usersModel
			.updateOne(
				{ username: payload.username },
				{ lastPages: userDTO.lastPages },
				// { $addToSet: { lastPages: `${getToday().today} ${getToday().time} -> ${payload.lastPage}` } },
				{
					projection: payload.secret ? {} : secretHidingObj,
				},
			)
			.exec();
	}

	async getUserLastPage(payload: UserIdentWithEmailPayload): Promise<string[]> {
		const userDTO = await this.usersModel.findOne(
			payload.username
				? { username: payload.username }
				: payload.email
				? { email: payload.email }
				: { _id: payload._id },
			{},
		);
		if (!userDTO.lastPages || !userDTO.lastPages.length || !userDTO.lastPages.logs) return [];

		const firstKey = Object.keys(userDTO.lastPages.logs).slice(1)[0];
		return userDTO.lastPages.length[firstKey];
	}

	async decodeJWT(token: string) {
		return this.jwtService.decode(token);
	}

	async updateUserRequestsLogs(payload: {
		username: string;
		lastRequest: string;
		secret?: boolean;
		decision: boolean | string;
	}) {
		const userDTO = await this.usersModel.findOne({ username: payload.username }, {});
		if (!userDTO) return;
		const { today, time: currentTime } = getToday();

		// new users check
		if (!userDTO.lastRequests.logs || Object.keys(userDTO.lastRequests.logs).length === 0) {
			userDTO.lastRequests.logs = { [today]: [`${currentTime} -> ${payload.lastRequest}`] };
			userDTO.lastRequests.length += 1;
		}

		if (userDTO.lastRequests === undefined)
			// cases where length more than max-limit or object dosent exists
			userDTO.lastRequests = { length: 0, logs: {} };
		else if (userDTO.lastRequests.length >= parseInt(process.env.LOGS_REQUESTS_LIMIT)) {
			const keys = Object.keys(userDTO.lastRequests.logs);
			if (twoDatesCompare(keys.slice(-1)[0], keys.slice(0)[0])) {
				userDTO.lastRequests.length -= userDTO.lastRequests.logs[keys.slice(0)[0]].length;
				delete userDTO.lastRequests.logs[keys.slice(0)[0]];
			} else {
				userDTO.lastRequests.length -= userDTO.lastRequests.logs[keys.slice(-1)[0]].length;
				delete userDTO.lastRequests.logs[keys.slice(-1)[0]];
			}
		}

		// updating lastRequests object with passed lastRequest string
		if (today in userDTO.lastRequests.logs) {
			userDTO.lastRequests.logs[today].unshift(
				`[${
					typeof payload.decision === 'string' ? payload.decision : payload.decision ? 'approve' : 'deny'
				}] ${currentTime} -> ${payload.lastRequest}`,
			);
		} else {
			userDTO.lastRequests.logs[today] = [`${currentTime} -> ${payload.lastRequest}`];
		}
		userDTO.lastRequests.length += 1;

		return await this.usersModel
			.updateOne(
				{ username: payload.username },
				{ lastRequests: userDTO.lastRequests },
				// { $addToSet: { lastRequests: `${getToday().today} ${getToday().time} -> ${payload.lastRequest}` } },
				{
					projection: payload.secret ? {} : secretHidingObj,
				},
			)
			.exec();
	}

	async updateAuthRequestDate(payload: { userIdent: UserIdentPayload; value?: string }) {
		return await this.usersModel
			.updateOne(
				payload.userIdent._id ? { _id: payload.userIdent._id } : { username: payload.userIdent.username },
				{ lastAuthRequest: payload.value || `${getToday().today} ${getToday().time}` },
				{ projection: payload.userIdent.secret ? {} : secretHidingObj },
			)
			.exec();
	}

	async updateEmailRequestDate(payload: UserIdentPayload) {
		return await this.usersModel
			.updateOne(
				payload._id ? { _id: payload._id } : { username: payload.username },
				{ lastEmailRequest: `${getToday().today} ${getToday().time}` },
				{ projection: payload.secret ? {} : secretHidingObj },
			)
			.exec();
	}

	async updateLastEmailUpdateRequest(payload: UserIdentPayload) {
		return await this.usersModel
			.updateOne(
				payload._id ? { _id: payload._id } : { username: payload.username },
				{ lastEmailUpdateRequest: `${getToday().today} ${getToday().time}` },
				{ projection: payload.secret ? {} : secretHidingObj },
			)
			.exec();
	}

	async updateRequestedEmailToken(payload: UserIdentPayload & { token: string }) {
		return await this.usersModel
			.updateOne(
				payload._id ? { _id: payload._id } : { username: payload.username },
				{ _requestedEmailToken: payload.token },
				{ projection: payload.secret ? {} : secretHidingObj },
			)
			.exec();
	}

	async updateRequestedEmailUser(payload: UserIdentPayload & { requestedEmail: string }) {
		return await this.usersModel
			.updateOne(
				payload._id ? { _id: payload._id } : { username: payload.username },
				{ _requestedEmail: payload.requestedEmail },
				{ projection: payload.secret ? {} : secretHidingObj },
			)
			.exec();
	}

	async updatePasswordRequestDate(payload: UserIdentPayload) {
		return await this.usersModel
			.updateOne(
				payload._id ? { _id: payload._id } : { username: payload.username },
				{ lastPasswordRequest: `${getToday().today} ${getToday().time}` },
				{ projection: payload.secret ? {} : secretHidingObj },
			)
			.exec();
	}

	async getUserPersonalData(payload: UserIdentPayload): Promise<UserPersonalT> {
		try {
			return (
				await this.usersModel.findOne(
					payload._id ? { _id: payload._id } : { username: payload.username },
					'personal -_id',
				)
			).personal;
		} catch (e) {
			throw new NotValidDataError();
		}
	}

	/**
	 * @IUnknown404I This function updates the user according passed ident data with passed personal object.
	 * If avatar changes, old file will be removed by the new one (as with upload-avatar function).
	 * @param payload as Object with UserIdentPayload and UserPersonalType attributes;
	 * @returns mongoose update-object or throws an error.
	 */
	async updatePersonalUserData(payload: { ident: UserIdentPayload; personal: UserPersonalT }) {
		const requestedUser = await this.findUser({ ...payload.ident, secret: true });

		// current user's avatar file check
		if (payload.personal.avatar) {
			const currentAvatarValidPath: string | undefined = requestedUser.personal.avatar
				? 'public/users/avatars/' +
				  (requestedUser.personal.avatar.startsWith('/')
						? requestedUser.personal.avatar.slice(1)
						: requestedUser.personal.avatar)
				: undefined;

			// check for uploaded image existance if passed new avatar from default list
			if (
				!!currentAvatarValidPath &&
				requestedUser.personal.avatar !== payload.personal.avatar &&
				requestedUser.personal.avatar.includes('defaults/') &&
				fs.existsSync(currentAvatarValidPath) &&
				fs.lstatSync(currentAvatarValidPath).isDirectory()
			)
				fs.unlink(currentAvatarValidPath, err => logapp.log(err));
		}

		return await this.usersModel.updateOne(
			payload.ident._id ? { _id: payload.ident._id } : { username: payload.ident.username },
			{ personal: payload.personal },
			{ projection: payload.ident.secret ? {} : secretHidingObj },
		);
	}

	async getUserAvatar(payload: UserIdentPayload): Promise<string> {
		try {
			return (
				(
					await this.usersModel.findOne(
						payload._id ? { _id: payload._id } : { username: payload.username },
						'personal.avatar -_id',
					)
				).personal?.avatar || ''
			);
		} catch (e) {
			throw new NotValidDataError();
		}
	}

	async updateUserAvatar(payload: { ident: UserIdentPayload; avatarUrl: string }) {
		return await this.usersModel.updateOne(
			payload.ident._id ? { _id: payload.ident._id } : { username: payload.ident.username },
			{ 'personal.avatar': payload.avatarUrl },
			{ projection: payload.ident.secret ? {} : secretHidingObj },
		);
	}

	async getUserMetaInfo(ident: UserIdentPayload) {
		return (
			(await this.usersModel.findOne(ident._id ? { _id: ident._id } : { username: ident.username }, {
				projection: ident.secret ? {} : secretHidingObj,
			})) as User
		).metaInfo;
	}

	async updateMetaInformation(payload: { ident: UserIdentPayload; metaInfo: Partial<UserMetaInformationI> }) {
		if (payload.metaInfo == null || Object.keys(payload.metaInfo).length === 0) throw new NotValidDataError();
		const userMetaInfo = (
			(await this.usersModel.findOne(
				payload.ident._id ? { _id: payload.ident._id } : { username: payload.ident.username },
			)) as User
		).metaInfo;
		return await this.usersModel.updateOne(
			payload.ident._id ? { _id: payload.ident._id } : { username: payload.ident.username },
			{ metaInfo: { ...userMetaInfo, ...payload.metaInfo } },
			{ projection: payload.ident.secret ? {} : secretHidingObj },
		);
	}

	async updateUserFingerprints(payload: { ident: UserIdentPayload; fingerprints: string }) {
		if (payload.fingerprints == null) throw new NotValidDataError();
		return await this.usersModel.updateOne(
			payload.ident._id ? { _id: payload.ident._id } : { username: payload.ident.username },
			{ lastFingerprints: payload.fingerprints },
			{ projection: payload.ident.secret ? {} : secretHidingObj },
		);
	}

	async getUserFriends(username: string): Promise<UserFriendsI> {
		if (!username) throw new NotValidDataError();
		return (await this.usersModel.findOne({ username })).friends;
	}

	async addUserFriend(username: string, friendUsername: string, loopbreak?: boolean): Promise<UserFriendsI> {
		if (!username || !friendUsername) throw new NotValidDataError();

		const friends = (await this.usersModel.findOne({ username })).friends;
		friends.accepted = [...friends.accepted, friendUsername];

		if (friends.pending.includes(friendUsername))
			friends.pending = friends.pending.filter(username => username !== friendUsername);
		if (friends.requested.includes(friendUsername))
			friends.requested = friends.requested.filter(username => username !== friendUsername);

		await this.usersModel.updateOne({ username }, { friends });

		if (loopbreak) return friends;
		this.addUserFriend(friendUsername, username, true);
		return friends;
	}

	async requestUserFriend(username: string, friendUsername: string) {
		if (!username || !friendUsername) throw new NotValidDataError();
		await this.usersModel.updateOne({ username }, { $push: { 'friends.requested': friendUsername } });
		return await this.usersModel.updateOne(
			{ username: friendUsername },
			{ $push: { 'friends.pending': username } },
		);
	}

	async requestRejectUserFriend(username: string, friendUsername: string) {
		if (!username || !friendUsername) throw new NotValidDataError();
		await this.usersModel.updateOne({ username }, { $pull: { 'friends.requested': friendUsername } });
		return await this.usersModel.updateOne(
			{ username: friendUsername },
			{ $pull: { 'friends.pending': username } },
		);
	}

	async rejectUserFriend(username: string, friendUsername: string) {
		if (!username || !friendUsername) throw new NotValidDataError();
		await this.usersModel.updateOne({ username }, { $pull: { 'friends.pending': friendUsername } });
		return await this.usersModel.updateOne(
			{ username: friendUsername },
			{ $pull: { 'friends.requested': username } },
		);
	}

	async deleteUserFriend(username: string, friendUsername: string) {
		if (!username || !friendUsername) throw new NotValidDataError();
		await this.usersModel.updateOne({ username }, { $pull: { 'friends.accepted': friendUsername } });
		return await this.usersModel.updateOne(
			{ username: friendUsername },
			{ $pull: { 'friends.accepted': username } },
		);
	}
}
