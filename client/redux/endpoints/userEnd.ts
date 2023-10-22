import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { RetryOptions } from '@reduxjs/toolkit/dist/query/retry';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { FileWithSizeT } from '../../components/basics/fileDropper/filesFetch';
import logapp from '../../utils/logapp';
import { TagTypesRTK } from '../api';
import { UserMetaInformationI, UserPersonalT } from '../slices/user';

export const getUserEndpoints = (
	build: EndpointBuilder<
		BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {} & RetryOptions, {}>,
		TagTypesRTK,
		'OnyxApi'
	>,
) => {
	return {
		personal: build.query<UserPersonalT, string>({
			query: () => ({ url: '/users/personal', method: 'GET' }),
			// Pick out data and prevent nested properties in a hook or selector
			// transformResponse: response => (response as { personal: UserPersonalT }).personal,
			// Pick out error and prevent nested properties in a hook or selector
			// transformErrorResponse: (response) => response.error,
			// `result` is the server response
			providesTags: (result, error, id) => [{ type: 'User' }],
			// trigger side effects or optimistic updates
			onQueryStarted(
				id,
				{ dispatch, getState, extra, requestId, queryFulfilled, getCacheEntry, updateCachedData },
			) {},
			// handle subscriptions etc
			onCacheEntryAdded(
				id,
				{
					dispatch,
					getState,
					extra,
					requestId,
					cacheEntryRemoved,
					cacheDataLoaded,
					getCacheEntry,
					updateCachedData,
				},
			) {},
		}),
		putPersonal: build.mutation<any, UserPersonalT>({
			query: (personalData: UserPersonalT) => ({
				url: '/users/personal',
				method: 'PUT',
				body: personalData,
			}),
			// transformErrorResponse: (response: { status: string | number }, meta, arg) => response.status,
			onQueryStarted: async (arg, { dispatch, getState, extra, requestId, queryFulfilled, getCacheEntry }) => {
				logapp.info('[#] UserApi_putPersonal -> started.', arg);
				queryFulfilled.then(res => true).catch(e => false);
			},
			invalidatesTags: [{ type: 'User' }],
		}),

		meta: build.query<UserMetaInformationI, void>({
			query: () => ({ url: '/users/meta', method: 'GET' }),
			providesTags: () => [{ type: 'User-Meta' }],
		}),
		putMeta: build.mutation<boolean, Partial<UserMetaInformationI>>({
			query: (meta: Partial<UserMetaInformationI>) => ({
				url: '/users/meta',
				method: 'PUT',
				body: { metaInfo: meta },
			}),
			onQueryStarted: async (arg, { dispatch, getState, extra, requestId, queryFulfilled, getCacheEntry }) => {
				logapp.info('[#] UserApi_putMeta -> started.', arg);
				queryFulfilled.then(res => true).catch(e => false);
			},
			invalidatesTags: [{ type: 'User-Meta' }],
		}),

		allAvatars: build.query<FileWithSizeT[], string>({
			query: () => ({ url: '/files/users/avatars/defaults/all?extended=true', method: 'GET' }),
			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: response => (response as FileWithSizeT[]).sort((a, b) => a.url.localeCompare(b.url)),
			// `result` is the server response
			providesTags: (result, error, id) => [{ type: 'Avatars' }],
		}),
		userAvatars: build.mutation<any, { username: string; avatarServerPath: string }>({
			query: (data: { username: string; avatarServerPath: string }) => ({
				url: `/files/users/avatars/${data.username}`,
				body: { filepath: data.avatarServerPath },
				method: 'PUT',
			}),
			// Pick out data and prevent nested properties in a hook or selector
			// transformResponse: (response) => (response as { personal: UserPersonalT }).personal,
			invalidatesTags: [{ type: 'User' }],
		}),
	};
};
