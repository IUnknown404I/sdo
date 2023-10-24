import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const initialUserState: Partial<UserSliceI> = {};

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
				(state[attr as keyof AccessTokenPayload] as unknown) = action.payload[attr as keyof AccessTokenPayload];
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
