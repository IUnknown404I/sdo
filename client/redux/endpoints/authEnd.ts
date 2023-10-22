import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { RetryOptions } from '@reduxjs/toolkit/dist/query/retry';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { AuthLogindataI } from '../../components/pages/auth/login/LoginForm';
import { RegistrationDataI } from '../../components/pages/auth/registration/RegistrationForm';
import logapp from '../../utils/logapp';
import { AccessTokenI, TagTypesRTK } from '../api';
import AuthThunks from '../thunks/auth';

export const getAuthEndpoints = (
	build: EndpointBuilder<
		BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {} & RetryOptions, {}>,
		TagTypesRTK,
		'OnyxApi'
	>,
)=> {
	return {
		login: build.mutation({
			query: (loginData: AuthLogindataI) => ({
				url: '/auth/login-in',
				method: 'PUT',
				body: loginData,
			}),
			onQueryStarted: async (arg, { dispatch, getState, extra, requestId, queryFulfilled, getCacheEntry }) => {
				logapp.info('[#] AuthApi_login-in -> started.', arg);
				queryFulfilled
					.then(res => res.data as AccessTokenI)
					.then(tokendata => {
						logapp.info('[#] AuthApi_login-in -> got:', tokendata);
						dispatch(AuthThunks.authorize(tokendata));
						return tokendata;
					});
			},
		}),
		register: build.mutation<string, RegistrationDataI>({
			query: (registryData: RegistrationDataI) => ({
				url: '/users',
				method: 'POST',
				body: registryData,
				responseHandler: 'text',
			}),
			transformResponse: (responce: { data: 'true' | 'false' }) => responce.data,
			transformErrorResponse: (response: { status: string | number }, meta, arg) => response.status,
		}),
		clearCookies: build.mutation<string, string>({
			query: () => ({
				url: `${process.env.NEXT_PUBLIC_SELF}/api/clear-cookies`,
				responseHandler: 'text',
			}),
			transformErrorResponse: (response: { status: string | number }, meta, arg) => response.status,
			onQueryStarted: async (arg, { dispatch, getState, extra, requestId, queryFulfilled, getCacheEntry }) => {
				queryFulfilled.then(data => {
					return data.data as string;
				});
			},
		}),
	};
};
