import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { RetryOptions } from '@reduxjs/toolkit/dist/query/retry';
import { PUBLIC_WS_ROOMS } from '../../sockets/chat.ws';
import { TagTypesRTK } from '../api';

export interface ChatMessageI {
	rid?: (typeof PUBLIC_WS_ROOMS)[number] | string;
	username: string;
	fio: string;
	message: string;
	timeSent: number;
	role?: string;
	viewed?: number;
	modified?: ModifiedChatMessageOption;
}

export interface ChatI {
	rid: string;
	name: string;
	status: 'public' | 'group' | 'private';
	participators: ChatParticipatorI[];
	messages: ChatMessageI[];
	meta: ChatMetaI;
	online: number;
}

export const getChatEndpoints = (
	build: EndpointBuilder<
		BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {} & RetryOptions, {}>,
		TagTypesRTK,
		'OnyxApi'
	>,
) => {
	return {
		chatData: build.query<Omit<ChatI, 'messages'>, string>({
			query: (rid: string) => ({ url: `chats/data/${rid}`, method: 'GET' }),
			providesTags: () => [{ type: 'Chats' }],
		}),
		chatMessages: build.query<Pick<ChatI, 'messages'>['messages'], string>({
			query: (rid: string) => ({ url: `chats/messages/${rid}` }),
			providesTags: () => [{ type: 'Chats' }],
		}),
		createPrivateChat: build.mutation<string, { name: string; initialUsers?: string[] }>({
			query: (props: { name: string; initialUsers?: string[] }) => ({
				url: 'chats/private',
				body: { name: props.name, initialUsers: props.initialUsers },
				method: 'POST',
			}),
			invalidatesTags: [{ type: 'Chats' }],
		}),
		leavePrivateChat: build.mutation<string | any, { rid: string }>({
			query: (props: { rid: string }) => ({
				url: `chats/private/leave/${props.rid}`,
				method: 'PUT',
			}),
			invalidatesTags: [{ type: 'Chats' }],
		}),

		userChats: build.query<UserChatsObjectT, ''>({
			query: () => ({ url: 'chats', method: 'GET' }),
			providesTags: () => [{ type: 'Chats' }],
		}),
		userChatData: build.query<ChatContactsI, { username: string }>({
			query: (props: { username: string }) => ({ url: `chats/user-data/${props.username}`, method: 'GET' }),
			providesTags: () => [{ type: 'UsersData' }],
		}),

		privateParticipators: build.query<string[], ''>({
			query: () => ({ url: 'chats/user-participators/private', method: 'GET' }),
			providesTags: () => [{ type: 'Chats' }],
		}),
		privateChatRid: build.query<{ rid: string }, string>({
			query: (username: string) => ({ url: `chats/private/get-rid/${username}` }),
			providesTags: () => [{ type: 'Chats' }],
		}),

		friends: build.query<UserFriendsI, ''>({
			query: () => ({ url: 'chats/friends', method: 'GET' }),
			providesTags: () => [{ type: 'Friends' }],
		}),
		friendsAdd: build.mutation<any, { friendUsername: string }>({
			query: (props: { friendUsername: string }) => ({
				url: 'chats/friends/add',
				body: { friendUsername: props.friendUsername },
				method: 'PUT',
			}),
			invalidatesTags: [{ type: 'Friends' }],
		}),
		friendsRequest: build.mutation<any, { friendUsername: string }>({
			query: (props: { friendUsername: string }) => ({
				url: 'chats/friends/request',
				body: { friendUsername: props.friendUsername },
				method: 'PUT',
			}),
			invalidatesTags: [{ type: 'Friends' }],
		}),
		friendsRequestReject: build.mutation<any, { friendUsername: string }>({
			query: (props: { friendUsername: string }) => ({
				url: 'chats/friends/request-reject',
				body: { friendUsername: props.friendUsername },
				method: 'PUT',
			}),
			invalidatesTags: [{ type: 'Friends' }],
		}),
		friendsReject: build.mutation<any, { friendUsername: string }>({
			query: (props: { friendUsername: string }) => ({
				url: 'chats/friends/reject',
				body: { friendUsername: props.friendUsername },
				method: 'PUT',
			}),
			invalidatesTags: [{ type: 'Friends' }],
		}),
		friendsDelete: build.mutation<any, { friendUsername: string }>({
			query: (props: { friendUsername: string }) => ({
				url: 'chats/friends/delete',
				body: { friendUsername: props.friendUsername },
				method: 'PUT',
			}),
			invalidatesTags: [{ type: 'Friends' }],
		}),

		// contacts: build.query<ChatContactsI[], { username?: string; email?: string }>({
		// 	query: (props: { username?: string; email?: string }) => ({
		// 		url: `chats/contacts?${props.username ? `username=${props.username}` : `email=${props.email}`}`,
		// 		method: 'GET',
		// 	}),
		// 	providesTags: () => [{ type: 'Chats' }],
		// }),
	};
};

export type UserChatsObjectT = {
	public: string[];
	group: string[];
	private: string[];
};

export interface ChatParticipatorI {
	username: string;
	inTimestamp: number;
}

export interface ChatMetaI {
	createdAt: number;
	createdBy: 'system' | string;
}

export type ModifiedChatMessageOption = {
	timestamp: number;
	by: string; //username
};

export interface ChatContactsI {
	username: string;
	email: string;
	name: string;
	surname: string;
	position?: string;
	avatar?: string;
}

export type UserFriendsI = {
	accepted: string[];
	pending: string[];
	requested: string[];
};
