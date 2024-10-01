import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import logapp from '../../utils/logapp';
import { LoginFullObjI } from '../api';
import { RootState } from '../store';
import AuthThunks from '../thunks/auth';

export interface AccessTokenI {
	access_token?: string;
	expires_in?: string;
}

export const initialAccessTokenState: AccessTokenI = {
	access_token: undefined,
	expires_in: undefined,
};

export const accessTokenSlice = createSlice({
	name: 'accessToken',
	initialState: initialAccessTokenState,
	reducers: {
		*
	},
	extraReducers: builder => {
		builder.addCase(AuthThunks.fetchAndUpdateTokens.fulfilled, (state, action) => {
			*
		});
	},
});

export const { setAccessToken, clearAccessToken } = accessTokenSlice.actions;
export const selectAccessToken = (state: RootState) => state.accessToken;
export default accessTokenSlice.reducer;
