import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { RetryOptions } from '@reduxjs/toolkit/dist/query/retry';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { FileWithSizeT } from '../../components/basics/fileDropper/filesFetch';
import logapp from '../../utils/logapp';
import { TagTypesRTK } from '../api';
import {
	SystemRolesOptions,
	UserCreationType,
	UserFullInfoType,
	UserLoyalityBlockType,
	UserMetaInformationI,
	UserPersonalT,
} from '../slices/user';

export const getUserEndpoints = (
	build: EndpointBuilder<
		BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {} & RetryOptions, {}>,
		TagTypesRTK,
		'OnyxApi'
	>,
) => {
	return {
		adminUsersSearch: build.query<{ users: UserFullInfoType[]; total: number }, UserSearchPropsType>({
			query: data => ({
				url: '/users/advansed-search',
				method: 'POST',
				body: data,
			}),
			providesTags: () => [{ type: 'Users-Search' }],
		}),

		userLoyality: build.query<UserLoyalityBlockType, void | string>({
			query: requestedUsername => ({
				url: `/users/loyality${!!requestedUsername ? '?username=' + requestedUsername : ''}`,
				method: 'GET',
			}),
			providesTags: () => [{ type: 'Users-Loyality' }],
		}),
		convertUserEnergy: build.mutation<{ result: true }, void>({
			query: () => ({
				url: `/users/loyality/convert-energy`,
				method: 'PATCH',
			}),
			invalidatesTags: [{ type: 'Users-Loyality' }],
		}),
		incUserLoyalityCoins: build.mutation<
			{ result: true },
			{ coins: number; type?: 'inc' | 'dec'; requestedUsername?: string }
		>({
			query: data => ({
				url: `/users/loyality/coin${!!data.requestedUsername ? '?username=' + data.requestedUsername : ''}`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: [{ type: 'Users-Loyality' }],
		}),
		incUserLoyalityExp: build.mutation<
			{ result: true },
			{ exp: number; type?: 'inc' | 'dec'; requestedUsername?: string }
		>({
			query: data => ({
				url: `/users/loyality/experience${
					!!data.requestedUsername ? '?username=' + data.requestedUsername : ''
				}`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: [{ type: 'Users-Loyality' }],
		}),

		personal: build.query<UserPersonalT, string | undefined>({
			query: (username?: string) => ({
				url: '/users/personal' + (!!username ? `?username=${username}` : ''),
				method: 'GET',
			}),
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
		putPersonal: build.mutation<any, UserPersonalT & { username?: string }>({
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

		myActivity: build.query<UserActivityObjectType['logs'], void>({
			query: () => ({ url: '/users/activity', method: 'GET' }),
			providesTags: () => [{ type: 'User-Activity' }],
		}),
		updateMyActivity: build.mutation<any, void>({
			query: () => ({
				url: '/users/activity',
				method: 'PUT',
			}),
			onQueryStarted: async (arg, { dispatch, getState, extra, requestId, queryFulfilled, getCacheEntry }) => {
				logapp.info('[#] UserApi_putMeta -> started.', arg);
				queryFulfilled.then(res => true).catch(e => false);
			},
			invalidatesTags: [{ type: 'User-Activity' }],
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

		usersBlock: build.mutation<any, { usernames: string[]; isBlocked: boolean; reason?: string }>({
			query: data => ({
				url: `/users/block`,
				body: data,
				method: 'PUT',
			}),
			invalidatesTags: [{ type: 'User' }, { type: 'Users-Search' }],
		}),
		usersActivate: build.mutation<any, { usernames: string[]; isActive: boolean }>({
			query: data => ({
				url: `/users/activate`,
				body: data,
				method: 'PUT',
			}),
			invalidatesTags: [{ type: 'User' }, { type: 'Users-Search' }],
		}),
		usersForcedLogout: build.mutation<any, string[]>({
			query: usernames => ({
				url: `/users/logout-force`,
				body: { usernames },
				method: 'PUT',
			}),
			invalidatesTags: [{ type: 'User' }, { type: 'Users-Search' }],
		}),
	};
};

export type UserSearchPropsType = {
	username?: string;
	email?: string;
	isActive?: boolean | 'all';
	isBlocked?: boolean | 'all';
	creationType?: UserCreationType | 'all';
	systemRole?: keyof typeof SystemRolesOptions | 'all';
	from?: number;
	limit?: number;
};

export type UserActivityObjectType = {
	length: number;
	logs: {
		[key: string]: number;
	};
};
