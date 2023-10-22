import { QueryDefinition } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { RetryOptions } from '@reduxjs/toolkit/dist/query/retry';
import {
	BaseQueryApi,
	BaseQueryFn,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
	MutationDefinition,
	retry,
} from '@reduxjs/toolkit/query/react';
import { allowedReqURICheck, checkAccessTokenValidity, checkResponseForRefreshNeed } from '../../utils/http';
import { TagTypesRTK } from '../api';
import { AccessTokenI, setAccessToken } from '../slices/accessToken';
import { setSessionState } from '../slices/auth';
import { RootStoreState } from '../store';
import AuthThunks from '../thunks/auth';

export type EndpointQueryGen<T, U> = QueryDefinition<
	T,
	BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {} & RetryOptions, {}>,
	TagTypesRTK,
	U,
	'OnyxApi'
>;

export type EndpointMutatuinGen<T, U> = MutationDefinition<
	T,
	BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {} & RetryOptions, {}>,
	TagTypesRTK,
	U,
	'OnyxApi'
>;

interface BaseQueryGeneratorI {
	baseUrl?: string;
}

export const baseQuery = (props?: BaseQueryGeneratorI) => {
	const defaultBaseQuery = fetchBaseQuery({
		credentials: 'include',
		baseUrl: props?.baseUrl || `${process.env.NEXT_PUBLIC_SERVER}` || 'https://api.sdo.rnprog.ru',
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootStoreState).accessToken.access_token;
			if (token) headers.set('Authorization', `Bearer ${token}`);
			headers.set('Access-Control-Allow-Credentials', 'true');
			headers.set('access-control-allow-origin', '*');
			headers.set(
				'Access-Control-Allow-Headers',
				'Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization',
			);
			return headers;
		},
	});

	return async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
		const refreshAction = async (ignoreRetry: boolean = false) => {
			// api.dispatch(AuthThunks.fetchAndUpdateTokens());
			// if (!ignoreRetry) result = await defaultBaseQuery(args, api, extraOptions);

			(api.getState() as RootStoreState & { api: {} }).axiosInstance?.instance
				.put('/auth/refresh-token')
				.then(res => res.data as AccessTokenI)
				.then(async data => {
					api.dispatch(setAccessToken(data));
					if (!ignoreRetry) result = await defaultBaseQuery(args, api, extraOptions);
				})
				.catch(() => {
					api.dispatch(setSessionState('expired'));
					return { status: 401, data: { statusCode: 401, message: '[AUTH]: session lost' } };
				});
		};

		// validate access_token
		const accessTokenValidity = checkAccessTokenValidity(
			(api.getState() as RootStoreState & { api: {} }).accessToken,
		);
		if (!accessTokenValidity && !(typeof args !== 'string' && 'url' in args && !allowedReqURICheck(args.url)))
			await refreshAction(true);

		// send request
		let result = await defaultBaseQuery(args, api, extraOptions);

		// check responce state for re-fetch purposes
		if (checkResponseForRefreshNeed({ res: result, extra: !accessTokenValidity })) refreshAction();

		// bail out of retries immediately for specific responses
		if (result.error?.status === 404 || result.error?.status === 400 || result.error?.status === 403) {
			retry.fail(result.error);
		}
		return result;
	};
};

interface RetryBaseQueryGeneratorI extends BaseQueryGeneratorI {
	maxRetries?: number;
}

export const baseQueryWithRetry = (props?: RetryBaseQueryGeneratorI) => {
	return retry(baseQuery({ baseUrl: props?.baseUrl }), { maxRetries: props?.maxRetries || 3 });
};
