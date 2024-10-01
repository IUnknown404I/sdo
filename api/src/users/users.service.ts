import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { emailRegex } from 'globalPipes/EmailValidationPipe';
import { passwordRegex, passwordValidation } from 'globalPipes/PasswordValidationPipe';
import mongoose, { Model } from 'mongoose';
import { ChatService } from 'src/chat/chat.service';
import { CourseProgressDocument } from 'src/course-progress/course-progress.schema';
import { CourseProgressService } from 'src/course-progress/course-progress.service';
import { CoursesGroupsService } from 'src/courses/courses-groups.service';
import { CoursesDocument } from 'src/courses/courses.schema';
import { GlobalGroupsService } from 'src/global-groups/global-groups.service';
import { TestsRunDocument } from 'src/test-runs/test-runs.schema';
import logapp from 'utils/logapp';
import { NotValidDataError } from '../../errors/NotValidDataError';
import { getToday, twoDatesCompare } from '../../utils/date-utils';
import { UsersAuthService } from './users-auth-service';
import { UsersFriendsService } from './users-friends.service';
import { RESERVED_USERNAMES } from './users.public.controller';
import {
	AccessTokenPayload,
	AccountAdministrativeProps,
	STORED_UNIQUE_IPS_MAX_COUNT,
	SystemRolesOptions,
	User,
	UserCreationType,
	UserI,
	UserLoyalityBlockType,
	UserMetaInformationI,
	UserPersonalT,
	UsersDocument,
	generateDefaultUserObject,
	isSystemRoleOption,
} from './users.schema';

export interface UserIdentPayload {
	_id?: string | mongoose.Types.ObjectId;
	username?: string;
	secret?: boolean;
}
export interface UserIdentWithEmailPayload extends UserIdentPayload {
	email?: string;
}

export interface PublicUserData
	extends Omit<UserI, 'password' | 'activeRefreshToken' | 'recoveryToken' | 'failedAttempts' | '_lastIPs'> {}

export const adminRequestHidingObj = {
	_id: 0,
	__v: 0,
	password: 0,
	emailToken: 0,
	recoveryToken: 0,
	activeRefreshToken: 0,
	lastFingerprints: 0,
	_requestedEmail: 0,
	_requestedEmailToken: 0,
} as const;

export const secretHidingObj = {
	_id: 0,
	__v: 0,
	password: 0,
	globalGroupsID: 0,
	activeCoursesID: 0,
	finishedCoursesID: 0,

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
	_lastIPs: 0,
} as const;

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name, 'onyxDB') private usersModel: Model<UsersDocument>,
		@InjectModel(User.name, 'onyxDB') private coursesModel: Model<CoursesDocument>,
		@InjectModel(User.name, 'onyxDB') private courseProgressModel: Model<CourseProgressDocument>,
		@InjectModel(User.name, 'onyxDB') private testRunsModel: Model<TestsRunDocument>,
		private jwtService: JwtService,
		@Inject(forwardRef(() => UsersAuthService))
		private usersAuthService: UsersAuthService,
		@Inject(forwardRef(() => GlobalGroupsService))
		private globalGroupsService: GlobalGroupsService,
		@Inject(forwardRef(() => CoursesGroupsService))
		private coursesGroupsService: CoursesGroupsService,
		@Inject(forwardRef(() => CourseProgressService))
		private courseProgressService: CourseProgressService,
		@Inject(forwardRef(() => ChatService))
		private chatService: ChatService,
		@Inject(forwardRef(() => UsersFriendsService))
		private usersFriendsService: UsersFriendsService,
	) {}

	async getUserByAccessToken(token: string): Promise<PublicUserData>;
	async getUserByAccessToken(token: string, secret: true): Promise<User & { _id: string }>;
	async getUserByAccessToken(token: string, secret: false): Promise<PublicUserData>;
	async getUserByAccessToken(token: string, secret: boolean = false): Promise<User | PublicUserData> {
		if (!token) throw new UnauthorizedException('Предоставленны неверные аутентификационные данные!');
		const accessTokenData = (await this.decodeJWT(token)) as AccessTokenPayload;
		if (!('username' in accessTokenData) || !('_systemRole' in accessTokenData))
			throw new NotValidDataError('Предоставленны неверные аутентификационные данные!');
		return this.findUser({ username: accessTokenData.username, secret });
	}

	async findUser(payload: Omit<UserIdentPayload, 'secret'>): Promise<PublicUserData>;
	async findUser(payload: UserIdentPayload & { secret: true }): Promise<User & { _id: string }>;
	async findUser(payload: UserIdentPayload & { secret?: false | undefined }): Promise<PublicUserData>;
	async findUser(
		payload: UserIdentPayload & { secret?: boolean },
	): Promise<(User & { _id: string }) | PublicUserData>;
	async findUser(
		payload: Omit<UserIdentPayload, 'secret'> | UserIdentPayload,
	): Promise<(User & { _id: string }) | PublicUserData> {
		if (!payload._id && !payload.username) throw new NotValidDataError();
		return await this.usersModel
			.findOne(
				payload._id ? { _id: payload._id } : { username: payload.username },
				'secret' in payload && payload.secret ? {} : secretHidingObj,
			)
			.exec();
	}

	async getUsersAdvancedSearch(payload: {
		username?: string;
		email?: string;
		isActive?: boolean | 'all';
		isBlocked?: boolean | 'all';
		creationType?: UserCreationType | 'all';
		systemRole?: keyof typeof SystemRolesOptions | 'all';
		limit?: number;
		from?: number;
	}): Promise<{ users: User[]; total: number }> {
		const parsedLimit = !!payload.limit ? (payload.limit > 75 ? 75 : payload.limit) : 25;
		if (
			!payload.username &&
			!payload.email &&
			payload.isActive === undefined &&
			payload.isBlocked === undefined &&
			!payload.creationType &&
			!payload.systemRole
		) {
			const firstUsers = await this.usersModel.find(undefined, adminRequestHidingObj);
			const parsedUsers = !!payload.from
				? firstUsers.slice(payload.from, payload.from + parsedLimit)
				: firstUsers.slice(-parsedLimit);
			return { users: parsedUsers, total: firstUsers.length };
		}

		const filterObject = {
			username: { $regex: payload.username, $options: 'i' },
			email: { $regex: payload.email, $options: 'i' },
			isActive: payload.isActive,
			isBlocked: payload.isBlocked,
			_creationType: { $regex: payload.creationType, $options: 'i' },
			__systemRole: payload.systemRole,
		};
		if (!payload.username) delete filterObject.username;
		if (!payload.email) delete filterObject.email;
		if (payload.isActive === undefined || payload.isActive === 'all') delete filterObject.isActive;
		if (payload.isBlocked === undefined || payload.isBlocked === 'all') delete filterObject.isBlocked;
		if (!payload.creationType || payload.creationType === 'all') delete filterObject._creationType;
		if (!payload.systemRole || payload.systemRole === 'all') delete filterObject.__systemRole;

		const foundUsers = await this.usersModel.find(filterObject, adminRequestHidingObj);
		const parsedUsers = !!payload.from
			? foundUsers.slice(payload.from, payload.from + parsedLimit)
			: foundUsers.slice(0, parsedLimit);
		return { users: parsedUsers, total: foundUsers.length };
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

	async resendActiveEmailToUser(username: string, requestedUser: User): Promise<{ result: true }> {
		if (!username || !requestedUser) throw new NotValidDataError('Не предоставлены идентификаторы пользователя!');
		const userData = await this.findUser({ username, secret: true });
		if (!userData) throw new NotValidDataError('Предоставлены невалидные идентификаторы пользователя!');
		if (
			SystemRolesOptions[userData.__systemRole].accessLevel >
			SystemRolesOptions[requestedUser.__systemRole].accessLevel
		)
			throw new UnauthorizedException(
				'У вас недостаточно прав для выполнения действия с запрошенным пользователем!',
			);

		const today = getToday();
		const emailToken = await this.usersAuthService.createEmailToken();
		await this.usersAuthService.sendEmailVerification({
			username,
			email: userData.email,
			token: emailToken,
			createdAt: `${today.today} ${today.time}`,
		});
		await this.usersModel.updateOne({ username }, { emailToken, lastEmailRequest: `${today.today} ${today.time}` });
		return { result: true };
	}

	async createOne(props: {
		username: string;
		password: string;
		email: string;
		company?: string;
		activatedUser?: boolean;
		systemRole?: UserI['_systemRole'];
		creationType?: UserCreationType;
	}) {
		await this.userCreationAvailableCheck(props);

		const today = getToday();
		const emailToken = await this.usersAuthService.createEmailToken();
		const userDTO: User = generateDefaultUserObject({
			...props,
			isActive: props.activatedUser,
			password: await this.usersAuthService.hashData(props.password),
			emailToken,
		});

		if ((userDTO as Object).hasOwnProperty('activatedUser')) delete userDTO['activatedUser'];
		if ((userDTO as Object).hasOwnProperty('company')) delete userDTO['company'];

		if (!!props.activatedUser === false)
			this.usersAuthService.sendEmailVerification({
				username: props.username,
				email: props.email,
				token: emailToken,
				createdAt: `${today.today} ${today.time}`,
			});
		return await this.usersModel.create(userDTO);
	}

	async createUserFromAdminLayer(
		props: AccountAdministrativeProps & { createdBy: string; sendEmailVerification?: boolean },
	) {
		if (!props.createdBy) throw new UnauthorizedException('Не предоставлены идентификаторы инициатора запроса!');
		await this.userCreationAvailableCheck({ ...props, creationType: `createdBy-${props.createdBy}` });
		if (
			!props._permittedSystemRoles ||
			!Array.isArray(props._permittedSystemRoles) ||
			!props._permittedSystemRoles?.length
		)
			throw new NotValidDataError('Не предоставлены доступные роли пользователя!');
		else if (
			!props._permittedSystemRoles.reduce<boolean>((acc, cur) => (!acc ? false : isSystemRoleOption(cur)), true)
		)
			throw new NotValidDataError('Обнаружены несуществующие пользовательские роли в системе!');
		if (
			props.isActive === undefined ||
			typeof props.isActive !== 'boolean' ||
			props.isBlocked === undefined ||
			typeof props.isBlocked !== 'boolean'
		)
			throw new NotValidDataError(
				'Не предоставлены или предоставлены невалидные значения активации и блокировки пользователя!',
			);

		const today = getToday();
		const emailToken = await this.usersAuthService.createEmailToken();
		const userDTO: User = generateDefaultUserObject({
			...props,
			password: await this.usersAuthService.hashData(props.password),
			systemRole: props._permittedSystemRoles.reduce<keyof typeof SystemRolesOptions>(
				(acc, cur) => (SystemRolesOptions[acc].accessLevel >= SystemRolesOptions[cur].accessLevel ? acc : cur),
				'user',
			),
			permittedRoles: props._permittedSystemRoles,
			creationType: `createdby-${props.createdBy}`,
			emailToken: props.sendEmailVerification && !props.isActive ? emailToken : undefined,
			lastEmailRequest:
				props.sendEmailVerification && !props.isActive ? `${today.today} ${today.time}` : undefined,
		});

		if (props.sendEmailVerification && !props.isActive)
			this.usersAuthService.sendEmailVerification({
				username: props.username,
				email: props.email,
				token: emailToken,
				createdAt: `${today.today} ${today.time}`,
			});
		return await this.usersModel.create(userDTO);
	}

	/**
	 * @IUnknown404I
	 * @param props
	 */
	private async userCreationAvailableCheck(props: {
		username: string;
		email: string;
		password?: string;
		creationType?: UserCreationType;
	}): Promise<void> {
		const usernameExistsCheck = await this.findUser({ username: props.username });
		const emailExistsCheck = await this.usersModel.findOne({
			$and: [{ email: props.email }, { emailToken: 'verificated' }],
		});
		if (usernameExistsCheck) throw new NotValidDataError('Такой пользователь уже существует!');
		if (emailExistsCheck) throw new NotValidDataError('Эта почта уже привязана к другому аккаунту!');
		if (RESERVED_USERNAMES.includes(props.username as (typeof RESERVED_USERNAMES)[number]))
			throw new NotValidDataError('Данный логин зарезервирован системой! Укажите другой.');
		if (!!props.password) passwordValidation(props.password);

		if (
			!!props.creationType &&
			(props.creationType.includes('createdby-') || props.creationType.includes('importedby-'))
		) {
			const creatorUserData = await this.findUser({
				username: props.creationType.split('-')[1] || '',
				secret: true,
			});
			if (!creatorUserData)
				throw new UnauthorizedException(
					'Инициатор создания не может быть определен! Подозрительная активность аккаунта.',
				);
			if (SystemRolesOptions[creatorUserData.__systemRole].accessLevel < 4)
				throw new UnauthorizedException(
					'У вас недостаточно прав для инициации создания учетной записи платформы!',
				);
		}
	}

	async deleteUser(userIdent: string | User, requestedUser: User) {
		if (!userIdent) throw new NotValidDataError();
		const userData =
			typeof userIdent !== 'string' ? userIdent : await this.findUser({ username: userIdent, secret: true });
		if (!userData?.username)
			throw new NotValidDataError('Переданы невалидные идентификаторы пользователя платформы!');

		// clear users global-groups
		if (!!userData.globalGroupsID) {
			for (let id of userData.globalGroupsID) {
				await this.globalGroupsService.deleteOneUserFromGroup(id, userData.username, requestedUser.username);
			}
		}
		// clear courses -> admins dto-s & local groups & group chats
		const allUserProgresses = await this.courseProgressService.getAllProgressesByUser(userData.username);
		for (const progress of allUserProgresses) {
			if (progress.role === 'teacher')
				this.coursesGroupsService.deleteCourseTeacher({
					cid: progress.cid,
					lgid: progress.lgid as string,
					username: progress.lgid,
					requestedUsername: requestedUser.username,
				});
			else if (progress.role === 'student' && !!progress.lgid)
				this.coursesGroupsService.deleteStudentFromLocalGroup({
					cid: progress.cid,
					lgid: progress.lgid as string,
					username: progress.username,
					requestedUser: requestedUser,
				});
		}
		// clear progresses
		this.courseProgressModel.deleteMany({ username: userData.username });
		// clear test-results and test-runs
		this.testRunsModel.deleteMany({ username: userData.username });

		// clear private chats
		for (const chat of userData.chats.private)
			await this.chatService.leavePrivateChat({
				rid: chat,
				username: userData.username,
				customMessage: 'Аккаунт собеседника удалён',
			});
		for (const chat of userData.chats.group)
			await this.chatService.deleteFromGroupChat({
				rid: chat,
				username: userData.username,
			});

		// clear friends and in-out requests
		for (const friend of userData.friends.accepted)
			await this.usersFriendsService.deleteUserFriend(userData.username, friend);
		for (const friendRequest of userData.friends.requested)
			await this.usersFriendsService.requestRejectUserFriend(userData.username, friendRequest);
		for (const friendRequest of userData.friends.pending)
			await this.usersFriendsService.rejectUserFriend(userData.username, friendRequest);
	}

	async updateUserFromAdminLayer(
		props: Omit<AccountAdministrativeProps, 'username' | 'avatar'> & {
			usernameToChange: string;
			requestedUser: User;
		},
	) {
		// regular checks
		if (!props.requestedUser) throw new UnauthorizedException('Не указаны идентификаторы инициатора запроса!');
		const userToChangeData = await this.findUser({ username: props.usernameToChange, secret: true });
		if (!userToChangeData) throw new NotValidDataError('Запрошенного пользователя не существует!');
		if (
			SystemRolesOptions[userToChangeData.__systemRole].accessLevel >
			SystemRolesOptions[userToChangeData.__systemRole].accessLevel
		)
			throw new UnauthorizedException(
				'У вас недостаточно прав для изменения параметров запрошенного пользователя!',
			);
		if (!!props.password && !passwordRegex.test(props.password))
			throw new NotValidDataError('Предоставлен некорректный пароль пользователя!');
		if (!emailRegex.test(props.email))
			throw new NotValidDataError('Предоставлен некорректная электронная почта пользователя!');
		// do passed roles check
		if (
			!props._permittedSystemRoles ||
			!Array.isArray(props._permittedSystemRoles) ||
			!props._permittedSystemRoles?.length
		)
			throw new NotValidDataError('Не предоставлены доступные роли пользователя!');
		else if (
			!props._permittedSystemRoles.reduce<boolean>((acc, cur) => (!acc ? false : isSystemRoleOption(cur)), true)
		)
			throw new NotValidDataError('Обнаружены несуществующие пользовательские роли в системе!');
		else if (
			!props._permittedSystemRoles.reduce<boolean>(
				(acc, cur) =>
					!acc
						? false
						: SystemRolesOptions[cur].accessLevel <=
						  SystemRolesOptions[props.requestedUser.__systemRole].accessLevel,
				true,
			)
		)
			throw new UnauthorizedException(
				'У вас недостаточно прав для назначения одной или нескольких из переданных ролей пользователя!',
			);
		// check for only booleans passed for boolean-typed properties
		if (
			props.isActive === undefined ||
			typeof props.isActive !== 'boolean' ||
			props.isBlocked === undefined ||
			typeof props.isBlocked !== 'boolean'
		)
			throw new NotValidDataError(
				'Не предоставлены или предоставлены невалидные значения активации и блокировки пользователя!',
			);

		const __newSystemRole = props._permittedSystemRoles.reduce<keyof typeof SystemRolesOptions>(
			(acc, cur) => (SystemRolesOptions[acc].accessLevel >= SystemRolesOptions[cur].accessLevel ? acc : cur),
			'user',
		);
		const parsedUserData = {
			password: !!props.password ? await this.usersAuthService.hashData(props.password) : '',
			email: props.email,
			isActive: props.isActive,
			isBlocked: props.isBlocked,
			blockReason: props.isBlocked ? 'Заблокирован администратором платформы.' : '',
			personal: {
				avatar: userToChangeData.personal.avatar || '',
				name: props.name || userToChangeData.personal.name || '',
				surname: props.surname || userToChangeData.personal.surname || '',
				tel: props.tel || userToChangeData.personal.tel || '',
				city: props.city || userToChangeData.personal.city || '',
				company: props.company || userToChangeData.personal.company || '',
				position: props.position || userToChangeData.personal.position || '',
			},
			_systemRole: !!props._permittedSystemRoles.includes(userToChangeData._systemRole)
				? userToChangeData._systemRole
				: __newSystemRole,
			__systemRole: __newSystemRole,
			permittedRoles: props._permittedSystemRoles,
		};
		if (!props.password) delete parsedUserData.password;
		return await this.usersModel.updateOne({ username: userToChangeData.username }, parsedUserData);
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
		if (!userDTO.lastPages.logs || !userDTO.activity.logs || Object.keys(userDTO.lastPages.logs).length === 0) {
			userDTO.lastPages.logs = { [today]: [`${currentTime} -> ${payload.lastPage}`] };
			userDTO.lastPages.length += 1;
		}

		// cases where length more than max-limit or object dosent exists
		if (userDTO.lastPages === undefined) userDTO.lastPages = { length: 0, logs: {} };
		else if (userDTO.lastPages.length >= parseInt(process.env.LOGS_PAGES_LIMIT)) {
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
		if (!token) throw new UnauthorizedException('Предоставленны неверные аутентификационные данные!');
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
			// cases where length more than max-limit or object doesnt exists
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

	async getUserLoyality(payload: { user: User; requestedUsername?: string }): Promise<UserLoyalityBlockType> {
		if (!!payload.requestedUsername && typeof payload.requestedUsername !== 'string')
			throw new NotValidDataError('Предоставлен невалидный идентификатор пользователя!');
		else if (!!payload.requestedUsername && SystemRolesOptions[payload.user._systemRole].accessLevel < 4)
			throw new UnauthorizedException('У вас недостаточно прав для данного запроса!');
		const requestedUser = !payload.requestedUsername
			? payload.user
			: await this.findUser({ username: payload.requestedUsername, secret: true });
		if (!requestedUser) throw new NotValidDataError('Предоставлены идентификаторы несуществующего пользователя!');
		return requestedUser.loyality;
	}

	async convertUserEnergy(user: User): Promise<{ result: true }> {
		if (!user) throw new NotValidDataError('Предоставлен невалидный идентификатор пользователя!');
		if (user.loyality.energy < 10) throw new NotValidDataError('У вас недостаточно энергии!');
		await this.usersModel.updateOne(
			{ username: user.username },
			{ $inc: { 'loyality.energy': -10, 'loyality.coins': 5 } },
		);
		return { result: true };
	}

	async patchUserLoyalityCoins(payload: {
		user: User;
		requestedUsername?: string;
		coins: number;
		type?: 'inc' | 'dec';
	}): Promise<{ result: true }> {
		if (payload.coins === undefined || typeof payload.coins !== 'number')
			throw new NotValidDataError('Предоставлено невалидное значение кол-ва монет пользователя!');
		if (!!payload.type && payload.type !== 'inc' && payload.type !== 'dec')
			throw new NotValidDataError('Предоставлен невалидный операнд операции!');
		if (!!payload.requestedUsername && typeof payload.requestedUsername !== 'string')
			throw new NotValidDataError('Предоставлен невалидный идентификатор пользователя!');
		else if (!!payload.requestedUsername && SystemRolesOptions[payload.user._systemRole].accessLevel < 4)
			throw new UnauthorizedException('У вас недостаточно прав для данного запроса!');
		const requestedUser = !payload.requestedUsername
			? payload.user
			: await this.findUser({ username: payload.requestedUsername, secret: true });
		if (!requestedUser) throw new NotValidDataError('Предоставлены идентификаторы несуществующего пользователя!');

		if (payload.type === 'dec')
			await this.usersModel.updateOne(
				{ username: requestedUser.username },
				{ $inc: { 'loyality.coins': -payload.coins } },
			);
		else
			await this.usersModel.updateOne(
				{ username: requestedUser.username },
				{ $inc: { 'loyality.coins': payload.coins } },
			);
		return { result: true };
	}

	async patchUserLoyalityExperience(payload: {
		user: User;
		requestedUsername?: string;
		exp: number;
		type?: 'inc' | 'dec';
	}): Promise<{ result: true }> {
		if (payload.exp === undefined || typeof payload.exp !== 'number')
			throw new NotValidDataError('Предоставлено невалидное значение кол-ва опыта пользователя!');
		if (!!payload.type && payload.type !== 'inc' && payload.type !== 'dec')
			throw new NotValidDataError('Предоставлен невалидный операнд операции!');
		if (!!payload.requestedUsername && typeof payload.requestedUsername !== 'string')
			throw new NotValidDataError('Предоставлен невалидный идентификатор пользователя!');
		else if (!!payload.requestedUsername && SystemRolesOptions[payload.user._systemRole].accessLevel < 4)
			throw new UnauthorizedException('У вас недостаточно прав для данного запроса!');
		const requestedUser = !payload.requestedUsername
			? payload.user
			: await this.findUser({ username: payload.requestedUsername, secret: true });
		if (!requestedUser) throw new NotValidDataError('Предоставлены идентификаторы несуществующего пользователя!');

		await this.incrementUserExperience(requestedUser, payload.type === 'dec' ? -payload.exp : payload.exp);
		return { result: true };
	}

	/**
	 * @IUnknown404I This function updates the user according passed ident data with passed personal object.
	 * If avatar changes, old file will be removed by the new one (as with upload-avatar function).
	 * @param payload as Object with UserIdentPayload and UserPersonalType attributes;
	 * @returns mongoose update-object or throws an error.
	 */
	async updatePersonalUserData(payload: {
		ident: UserIdentPayload;
		personal: UserPersonalT;
		requestedUserUsername?: string;
	}) {
		const requestedUser = await this.findUser({ ...payload.ident, secret: true });
		const requestedByUser = !!payload.requestedUserUsername
			? await this.findUser({ username: payload.requestedUserUsername, secret: true })
			: undefined;

		if (!requestedUser)
			throw new NotValidDataError(
				'Предоставлены невалидные идентификаторы пользователя для изменения информации!',
			);
		if (!!requestedByUser && SystemRolesOptions[requestedByUser.__systemRole].accessLevel < 4)
			throw new UnauthorizedException(
				'У вас недостаточно прав для запроса пользовательской информации другого аккаунта!',
			);
		else if (
			!!requestedByUser &&
			SystemRolesOptions[requestedByUser.__systemRole].accessLevel <
				SystemRolesOptions[requestedUser.__systemRole].accessLevel
		)
			throw new UnauthorizedException(
				'У вас недостаточно прав для изменения пользовательской информации запрошенного пользователя!',
			);

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

	async updateUserDynamicRole(user: string | (User & { _id: string }), newRole: User['_systemRole']) {
		if (!user || (typeof user !== 'string' && !('_id' in user)) || !newRole || !isSystemRoleOption(newRole))
			throw new NotValidDataError();
		const userData =
			typeof user === 'string'
				? ((await this.findUser({ username: user, secret: true })) as User & { _id: string })
				: user;
		if (!userData) throw new NotValidDataError();
		if (!userData._permittedSystemRoles?.length || userData._permittedSystemRoles.length === 1)
			throw new UnauthorizedException(
				'У вас недостаточно прав для изменения внутренних настроек учетной записи!',
			);
		if (!userData._permittedSystemRoles.includes(newRole))
			throw new UnauthorizedException('Вам недоступна запрошенная системная роль! Недосточно прав доступа.');
		return this.usersModel.updateOne({ username: userData.username }, { _systemRole: newRole });
	}

	async getMyActivity(user: (User & { _id: string }) | string): Promise<User['activity']['logs']> {
		const userData = typeof user === 'string' ? await this.findUser({ username: user, secret: true }) : user;
		if (!userData || !('_id' in userData)) throw new NotValidDataError();
		return userData.activity?.logs || {};
	}

	/**
	 * @param user user data with _id attribute or string as user's username;
	 * @param initialIncrement boolean flag for first-of-day increment (if activity is already more then 0, nothing will be changed).
	 */
	async updateMyActivity(user: (User & { _id: string }) | string, initialIncrement?: boolean) {
		let userDTO = typeof user === 'string' ? await this.findUser({ username: user, secret: true }) : user;
		if (!userDTO) throw new NotValidDataError();
		if (!('_id' in userDTO)) userDTO = await this.findUser({ username: (userDTO as User).username, secret: true });
		const { today } = getToday();

		// new users check or object doenst exist
		if (!userDTO.activity || !userDTO.activity.logs || Object.keys(userDTO.activity.logs).length === 0) {
			userDTO.activity = { length: 0, logs: {} };
		}
		// cases where length more than max-limit
		else if (userDTO.activity.length >= parseInt(process.env.USERS_ACTIVITY_LIMIT)) {
			const keys = Object.keys(userDTO.activity.logs);
			delete userDTO.activity.logs[keys[0]];
			userDTO.activity.length = userDTO.activity.length - 1;
		}

		// initial incrementing updating
		if (initialIncrement) {
			if (!(today in userDTO.activity.logs)) {
				userDTO.activity.logs[today] = 1;
				userDTO.activity.length = userDTO.activity.length + 1;
				// gaining 5 exp for the first-login-in for every user
				this.incrementUserExperience(userDTO, 5);
			} else if (userDTO.activity.logs[today] === 0) userDTO.activity.logs[today] = 1;
		} else {
			// standard activity updating
			if (today in userDTO.activity.logs) userDTO.activity.logs[today] = userDTO.activity.logs[today] + 1;
			else {
				userDTO.activity.length = userDTO.activity.length + 1;
				userDTO.activity.logs[today] = userDTO.activity.logs[today] + 1;
			}
		}

		return await this.usersModel
			.updateOne(
				{ username: userDTO.username },
				{ activity: userDTO.activity },
				{
					projection: secretHidingObj,
				},
			)
			.exec();
	}

	async updateUserIP(ip: string, user: User & { _id: string }) {
		if (!ip || ip === '::1' || ip.includes('::ffff') || !user || !user._id) return;
		const userData = await this.findUser({ username: user.username, secret: true });
		if (!userData) throw new NotValidDataError('Обнаружена попытка фальсификации данных!');

		let storedIPs = userData._lastIPs.slice();
		storedIPs.unshift(`${ip} ${+new Date()}`);
		if (storedIPs.length > STORED_UNIQUE_IPS_MAX_COUNT)
			storedIPs = storedIPs.slice(0, storedIPs.length - (storedIPs.length - STORED_UNIQUE_IPS_MAX_COUNT));
		return this.usersModel.updateOne({ username: userData.username }, { _lastIPs: storedIPs });
	}

	protected async incrementUserExperience(user: User, count: number) {
		if (!user || count === undefined || typeof count !== 'number') return;
		if (user.loyality.experience + count >= 100)
			await this.usersModel.updateOne(
				{ username: user.username },
				{
					$inc: { 'loyality.level': 1, 'loyality.coins': 100 },
					'loyality.experience': user.loyality.experience + count - 100,
				},
			);
		else if (user.loyality.experience + count < 0) {
			if (user.loyality.level === 1)
				await this.usersModel.updateOne(
					{ username: user.username },
					{ 'loyality.level': 0, 'loyality.experience': 0 },
				);
			else
				await this.usersModel.updateOne(
					{ username: user.username },
					{
						$inc: { 'loyality.level': -1 },
						'loyality.experience': 100 + user.loyality.experience + count,
					},
				);
		} else await this.usersModel.updateOne({ username: user.username }, { $inc: { 'loyality.experience': count } });
	}
}
