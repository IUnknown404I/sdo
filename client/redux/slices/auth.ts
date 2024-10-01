import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type SessionStateT = 'active' | 'expired' | 'closed';
export interface AuthReduxSliceI {
	state: boolean;
	sessionState: SessionStateT;
	lastPages?: string[];
	isBusy: boolean;
}

export const initialAuthState: AuthReduxSliceI = {
	state: false,
	sessionState: 'closed',
	lastPages: undefined,
	isBusy: false,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState: initialAuthState,
	reducers: {
		*
	},
});

export const { setAuthState, setSessionState, setLastPages, setBusyState, clearAll } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export const selectAuthBusy = (state: RootState) => state.auth.isBusy;
export default authSlice.reducer;
