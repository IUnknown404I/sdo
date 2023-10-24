import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type SessionStateT = 'active' | 'expired' | 'closed';
export interface AuthReduxSliceI {
	state: boolean;
	sessionState: SessionStateT;
	lastPages?: string[];
}

export const initialAuthState: AuthReduxSliceI = {
	state: false,
	sessionState: 'closed',
	lastPages: undefined,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState: initialAuthState,
	reducers: {
		setAuthState: (state, action: PayloadAction<AuthReduxSliceI['state']>) => {
			state.state = action.payload;
		},
		setSessionState: (state, action: PayloadAction<AuthReduxSliceI['sessionState']>) => {
			state.sessionState = action.payload;
		},
		setLastPages: (state, action: PayloadAction<AuthReduxSliceI['lastPages']>) => {
			state.lastPages = action.payload;
		},
		clearAll: state => {
			state = initialAuthState;
		},
	},
});

export const { setAuthState, setSessionState, setLastPages, clearAll } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
