import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type SessionStateT = 'active' | 'expired' | 'closed';
export interface AuthI {
	state: boolean;
	sessionState: SessionStateT;
	lastPages?: string[];
}

export const initialAuthState: AuthI = {
	state: false,
	sessionState: 'closed',
	lastPages: undefined,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState: initialAuthState,
	reducers: {
		setAuthState: (state, action: PayloadAction<boolean>) => {
			state.state = action.payload;
		},
		setSessionState: (state, action: PayloadAction<SessionStateT>) => {
			state.sessionState = action.payload;
		},
		setLastPages: (state, action: PayloadAction<string[] | undefined>) => {
			state.lastPages = action.payload;
		},
		clearAll: (state) => {
			state.state = false;
			state.sessionState = 'closed';
			state.lastPages = undefined;
		}
	},
});

export const { setAuthState, setSessionState, setLastPages, clearAll } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
