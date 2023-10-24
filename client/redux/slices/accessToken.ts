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
		setAccessToken: (state, action: PayloadAction<AccessTokenI | LoginFullObjI>) => {
			for (const attr in action.payload) {
				if (attr !== 'lastPages')
					state[attr as keyof AccessTokenI] = action.payload[attr as keyof AccessTokenI];
			}
		},
		clearAccessToken: state => {
			state = initialAccessTokenState;
		},
	},
	extraReducers: builder => {
		builder.addCase(AuthThunks.fetchAndUpdateTokens.fulfilled, (state, action) => {
			logapp.log('[#] THUNK REFRESH TOKEN TRIGGERED with result = ', action.payload);
		});
	},
});

export const { setAccessToken, clearAccessToken } = accessTokenSlice.actions;
export const selectAccessToken = (state: RootState) => state.accessToken;
export default accessTokenSlice.reducer;
