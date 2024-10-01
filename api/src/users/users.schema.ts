import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotValidDataError } from 'errors/NotValidDataError';
import { Document } from 'mongoose';
import { getDateFromOnyxDate, getToday } from 'utils/date-utils';

export const STORED_UNIQUE_IPS_MAX_COUNT = 50 as const;

export type UsersDocument = Document & User;
export interface UserI {
	__systemRole: keyof typeof SystemRolesOptions; // permanent option for inner-use (initial max-user-role)
	_systemRole: keyof typeof SystemRolesOptions; // options that could be changed by users and was sent to the client
	_permittedSystemRoles: (keyof typeof SystemRolesOptions)[]; // list of available roles to change for _systemRole option
	_creationType?: UserCreationType;

	username: string;
	password: string;
	email: string;
	personal?: UserPersonalT;
	activity: {
		length: number;
		logs: {
			[key: string]: number;
		};
	};

	metaInfo?: UserMetaInformationI;
	createdAt: string;
	lastLoginIn: string;
	lastModified: string;
	lastAuthRequest: string;
	lastEmailRequest: string;
	lastEmailUpdateRequest: string;
	lastPasswordRequest: string;
	_lastIPs: string[]; // '[IP] [timestamp]'

	emailToken: string;
	_requestedEmail: string;
	_requestedEmailToken: string;
	recoveryToken: string;
	isActive: boolean;
	isBlocked: boolean;
	blockReason: string;
	failedAttempts: number;
	activeRefreshToken: string;

	loyality: UserLoyalityBlockType;
	globalGroupsID: string[];
	// activeCoursesID: UserCoursesAttributeItemType[];
	// finishedCoursesID: UserCoursesAttributeItemType[];

	friends: UserFriendsI;
	chats: {
		public: string[];
		group: string[];
		private: string[];
	};

	lastFingerprints?: string;
	lastPages?: {
		length: number;
		logs: {
			[key: string]: string[];
		};
	};
	lastRequests?: {
		length: number;
		logs: {
			[key: string]: string[];
		};
	};
}

export interface AccessTokenPayload {
	_systemRole: keyof typeof SystemRolesOptions;
	_permittedSystemRoles: (keyof typeof SystemRolesOptions)[];
	username: string;
	email: string;
	lastLoginIn: string;
	isActive: boolean;
	isBlocked: boolean;
	blockReason: string;
	failedAttempts: number;
	createdAt: string;
	lastFingerprints?: string;
}

export type UserCoursesAttributeItemType = {
	cid: string;
	groupID: string;
	fromTimestamp: number;
	toTimestamp: number;
};

export type UserPersonalT = {
	name?: string;
	surname?: string;
	city?: string;
	company?: string;
	position?: string;
	tel?: string;
	avatar?: string;
};

export type UserMetaInformationI = {
	theme: 'light' | 'dark';
	contactVisibility: boolean;
	pushStatus: boolean;
	prefferedCommunication: 'email' | 'tel' | 'service';
};

export type UserFriendsI = {
	accepted: string[];
	pending: string[];
	requested: string[];
};

export type UserLoyalityBlockType = {
	coins: number;
	energy: number;
	level: number;
	experience: number;
	acquiredAwards: Array<{ awid: string; timestamp: number }>;
};

/**
 * could be 'system', 'self-registry' or
 * string as: 'createdby-${admin_username}' | 'importedby-${admin_username}'
 */
export type UserCreationType = string | 'system' | 'self-registry';

@Schema()
export class User {
	@Prop({ required: true, type: 'string' })
	__systemRole: keyof typeof SystemRolesOptions;
	@Prop({ required: true, type: 'string' })
	_systemRole: keyof typeof SystemRolesOptions;
	@Prop({ required: false, type: Array })
	_permittedSystemRoles: (keyof typeof SystemRolesOptions)[];
	@Prop({ required: false, type: 'string' })
	_creationType?: UserCreationType;

	@Prop({ required: true, unique: true })
	username: string;
	@Prop({ required: true })
	password: string;
	@Prop({ required: true })
	email: string;
	@Prop({ type: 'object', required: false })
	personal: UserPersonalT;
	@Prop({ type: 'object', required: true })
	activity: {
		length: number;
		logs: {
			[key: string]: number;
		};
	};
	@Prop({ required: true, type: Array })
	globalGroupsID: string[];
	@Prop({ type: 'object', required: true })
	loyality: UserLoyalityBlockType;

	@Prop({ type: 'object', required: false })
	metaInfo: UserMetaInformationI;
	@Prop({ required: false })
	createdAt: string;
	@Prop({ required: false })
	lastModified: string;
	@Prop({ required: false })
	lastLoginIn: string;
	@Prop({ required: false })
	lastAuthRequest: string;
	@Prop({ required: false })
	lastEmailRequest: string;
	@Prop({ required: false })
	lastEmailUpdateRequest: string;
	@Prop({ required: true, type: Array })
	_lastIPs: string[];

	@Prop({ required: false })
	_requestedEmail: string;
	@Prop({ required: false })
	_requestedEmailToken: string;
	@Prop({ required: false })
	lastPasswordRequest: string;
	@Prop({ required: true })
	emailToken: string;
	@Prop({ required: true })
	recoveryToken: string;
	@Prop({ required: true })
	isActive: boolean;
	@Prop({ required: true })
	isBlocked: boolean;
	@Prop({ required: false })
	blockReason: string;
	@Prop({ required: false })
	failedAttempts: number;
	@Prop({ required: false })
	activeRefreshToken: string;

	@Prop({ type: 'object', required: true })
	chats: {
		public: string[];
		group: string[];
		private: string[];
	};
	@Prop({ type: 'object', required: true })
	friends: UserFriendsI;

	@Prop({ required: false })
	lastFingerprints: string;
	@Prop({ type: 'object', required: false })
	lastPages: {
		length: number;
		logs: {
			[key: string]: string[];
		};
	};
	@Prop({ type: 'object', required: false })
	lastRequests: {
		length: number;
		logs: {
			[key: string]: string[];
		};
	};
}

export const userSchema = SchemaFactory.createForClass(User);

export const SystemRolesOptions = {
	superuser: { accessLevel: 6, translation: 'Владелец платформы' },
	developer: { accessLevel: 5, translation: 'Разработчик платформы' },
	admin: { accessLevel: 4, translation: 'Администратор платформы' },
	tutor: { accessLevel: 3, translation: 'Куратор' },
	content: { accessLevel: 2, translation: 'Контент-мейкер' },
	teacher: { accessLevel: 1, translation: 'Преподаватель' },
	user: { accessLevel: 0, translation: 'Пользователь' },
};
export const isSystemRoleOption = (
	systemrole: string | keyof typeof SystemRolesOptions,
): systemrole is keyof typeof SystemRolesOptions => systemrole in SystemRolesOptions;

export const generateDefaultUserObject = (props: {
	username: string;
	password: string;
	email: string;
	emailToken?: string;
	name?: string;
	surname?: string;
	company?: string;
	position?: string;
	city?: string;
	tel?: string;
	systemRole?: UserI['_systemRole'];
	permittedRoles?: UserI['_systemRole'][];
	createdAt?: string;
	lastModified?: string;
	creationType?: UserCreationType;
	isActive?: boolean;
	isBlocked?: boolean;
	blockReason?: string;
	initialIP?: string;
	lastAuthRequest?: string;
	lastEmailRequest?: string;
}): User => {
	const today = getToday();
	const systemRole = isSystemRoleOption(props.systemRole) ? props.systemRole : 'user';
	const parsedPermittedSystemRoles = !!props.permittedRoles
		? props.permittedRoles.reduce(
				(acc, cur, index, arr) =>
					isSystemRoleOption(cur)
						? [...acc, cur]
						: // if all values are invalid then return [{ systemRole }] by default (not empty one)
						index === arr.length - 1 && !acc.length
						? [systemRole]
						: acc,
				[] as UserI['_systemRole'][],
		  )
		: [systemRole];

	try {
		if (!!props.lastAuthRequest) getDateFromOnyxDate(props.lastAuthRequest);
	} catch (e) {
		throw new NotValidDataError('Указана невалидная дата последнего аутентификационного запроса!');
	}
	try {
		if (!!props.lastEmailRequest) getDateFromOnyxDate(props.lastEmailRequest);
	} catch (e) {
		throw new NotValidDataError('Указана невалидная дата последнего запроса активации аккаунта!');
	}

	return {
		...props,
		__systemRole: systemRole,
		_systemRole: systemRole,
		_permittedSystemRoles: parsedPermittedSystemRoles,
		_creationType: props.creationType,

		password: props.password || '',
		emailToken: props.emailToken || props.isActive === true ? 'verificated' : '',
		personal: {
			name: props.name || props.username,
			surname: props.surname || 'Пользователь',
			company: props.company || '',
			city: props.city || '',
			position: props.position || '',
			tel: props.tel || '',
		},
		activity: {
			length: 0,
			logs: {},
		},

		loyality: {
			coins: 0,
			energy: 100,
			level: 1,
			experience: 0,
			acquiredAwards: [],
		},
		globalGroupsID: [],
		// activeCoursesID: [],
		// finishedCoursesID: [],

		metaInfo: { theme: 'light', contactVisibility: true, pushStatus: true, prefferedCommunication: 'email' },
		recoveryToken: 'none',
		isActive: props.isActive === undefined ? false : props.isActive,
		isBlocked: props.isBlocked === undefined ? false : props.isBlocked,
		blockReason: props.blockReason || '',
		createdAt: props.createdAt || `${today.today} ${today.time}`,
		lastModified: props.createdAt || `${today.today} ${today.time}`,
		lastLoginIn: 'never',
		lastAuthRequest: props.lastAuthRequest || 'never',
		lastEmailRequest: props.lastEmailRequest || 'never',
		lastEmailUpdateRequest: 'never',
		_lastIPs: !!props.initialIP ? [props.initialIP] : [],

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
};

// [username, password, email, name?, surname?, company?, position?, city?, __systemRole? (initial), isActive?, isBlocked?]
export type ImportUsersExcelOutputType = Array<
	[
		string,
		string,
		string,
		string | undefined,
		string | undefined,
		string | undefined,
		string | undefined,
		string | undefined,
		string | undefined,
		(typeof SystemRolesOptions)[keyof typeof SystemRolesOptions]['translation'] | undefined,
		'+' | '-' | undefined,
		'+' | '-' | undefined,
	]
>;
export type ImportUserPropsType = {
	username: string;
	password: string;
	email: string;
	name: string;
	surname: string;
	company: string;
	position: string;
	city: string;
	tel: string;
	__systemRole: keyof typeof SystemRolesOptions;
	isActive: boolean;
	isBlocked: boolean;
};

export interface AccountAdministrativeProps {
	username: string;
	password: string;
	email: string;
	name: string;
	surname: string;
	city: string;
	company: string;
	position: string;
	tel: string;
	avatar: string;
	isActive: boolean;
	isBlocked: boolean;
	// __systemRole: keyof typeof SystemRolesOptions;
	_permittedSystemRoles: Array<keyof typeof SystemRolesOptions>;
}
