import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { RootState } from '../store';
import { generateAxiosInstance } from '../utils/axiosUtils';
import { setAccessToken } from './accessToken';

export const initialInstanceState = { instance: generateAxiosInstance({ setAccessToken: () => {}, clearBearer: () => {} }) };

export const axiosInstanceSlice = createSlice({
	name: 'axiosInstance',
	initialState: initialInstanceState,
	reducers: {
		*
	},
});

export const { setBearer, clearBearer } = axiosInstanceSlice.actions;
export const selectAxiosInstance = (state: RootState): AxiosInstance => state.axiosInstance?.instance;
export default axiosInstanceSlice.reducer;
