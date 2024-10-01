import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserFriendsI } from '../endpoints/chatEnd';
import { RootState } from '../store';

export const initialUserState: UserSliceI = {
	_systemRole: 'user',
	_permittedSystemRoles: ['user'],
};

export const userSlice = createSlice({
	name: 'user',
	initialState: initialUserState,
	reducers: {
		setUserAttributes: (state, action: PayloadAction<UserSliceI>) => {
			for (const attr in action.payload) {
				(state[attr as keyof UserSliceI] as unknown) = action.payload[attr as keyof UserSliceI];
			}
		},
		setUserDataFromPayload: (state, action: PayloadAction<AccessTokenPayload>) => {
			if (Object.keys(action.payload).length === 0) return;
			for (const attr in action.payload) {
				if (attr === '_systemRole' && isSystemRoleOption(action.payload._systemRole))
					state._systemRole = action.payload._systemRole;
				else
					(state[attr as keyof AccessTokenPayload] as unknown) =
						action.payload[attr as keyof AccessTokenPayload];
			}
		},
		personal: (state, action: PayloadAction<UserPersonalT>) => {
			if (Object.keys(action.payload).length === 0) return;
			for (const attr in action.payload) {
				if (state.personal === undefined) state.personal = {};
				state.personal[attr as keyof UserPersonalT] = action.payload[attr as keyof UserPersonalT];
			}
		},
		clearUserData: state => {
			state = initialUserState;
		},
	},
});

export const { setUserDataFromPayload, clearUserData, setUserAttributes, personal } = userSlice.actions;
export const selectUser = (state: RootState): UserSliceI => state.user;
export default userSlice.reducer;

export interface AccessTokenPayload {
	_systemRole: keyof typeof SystemRolesOptions;
	_permittedSystemRoles: (keyof typeof SystemRolesOptions)[];
	username?: string;
	email?: string;
	createdAt?: string;
	lastModified?: string;
	lastLoginIn?: string;
	isBlocked?: boolean;
	blockReason?: string;
	isActive?: boolean;
	failedAttempts?: number;
	lastFingerprints?: string;
}

export interface UserSliceI {
	_systemRole: keyof typeof SystemRolesOptions;
	_permittedSystemRoles: (keyof typeof SystemRolesOptions)[];
	username?: string;
	email?: string;
	createdAt?: string;
	lastModified?: string;
	lastLoginIn?: string;
	isBlocked?: boolean;
	blockReason?: string;
	isActive?: boolean;
	failedAttempts?: number;
	personal?: UserPersonalT;
	metaInfo?: UserMetaInformationI;
	lastFingerprints?: string;

	// globalGroupsID: string[];
	// activeCoursesID: UserCoursesAttributeItemType[];
	// finishedCoursesID: UserCoursesAttributeItemType[];
}

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

/**
 * could be 'system', 'self-registry' or
 * string as: 'createdby-${admin_username}' | 'importedby-${admin_username}'
 */
export type UserCreationType = string | 'system' | 'self-registry';

export const SystemRolesOptions = {
	superuser: { accessLevel: 6, translation: 'Владелец' },
	developer: { accessLevel: 5, translation: 'Разработчик' },
	admin: { accessLevel: 4, translation: 'Администратор' },
	tutor: { accessLevel: 3, translation: 'Куратор' },
	content: { accessLevel: 2, translation: 'Контент-мейкер' },
	teacher: { accessLevel: 1, translation: 'Преподаватель' },
	user: { accessLevel: 0, translation: 'Пользователь' },
};

export const isSystemRoleOption = (
	systemrole: string | keyof typeof SystemRolesOptions,
): systemrole is keyof typeof SystemRolesOptions => systemrole in SystemRolesOptions;

// only for user-admin layers use
// this type doesnt appear anythere else
export type UserFullInfoType = {
	*
};

export type UserLoyalityBlockType = {
	coins: number;
	energy: number;
	level: number;
	experience: number;
	acquiredAwards: Array<{ awid: string; timestamp: number }>;
};
