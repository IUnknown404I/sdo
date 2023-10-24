import { createApi } from '@reduxjs/toolkit/query/react';
import { getAuthEndpoints } from './endpoints/authEnd';
import { getChatEndpoints } from './endpoints/chatEnd';
import { getUserEndpoints } from './endpoints/userEnd';
import { baseQueryWithRetry } from './utils/apiUtils';
import { getCoursesEndpoints } from './endpoints/coursesEnd';

export const TAG_TYPES_RTK = [
	// auth
	...['Auth', 'Refresh'],
	// users
	...['User', 'User-Meta'],
	// files
	...['Avatars'],
	// messanger
	...['Chats', 'Friends', 'UsersData'],
	// courses
	...['Courses', 'CourseData'],
] as const;
export type TagTypesRTK = (typeof TAG_TYPES_RTK)[number];

export const rtkApi = createApi({
	reducerPath: 'OnyxApi',
	baseQuery: baseQueryWithRetry({ baseUrl: process.env.NEXT_PUBLIC_SERVER, maxRetries: 1 }),
	tagTypes: TAG_TYPES_RTK,
	endpoints: build => {
		return {
			...getAuthEndpoints(build),
			...getUserEndpoints(build),
			...getChatEndpoints(build),
			...getCoursesEndpoints(build),
		};
	},
});

export interface AccessTokenI {
	access_token: string;
	expires_in: string;
}

export interface LoginFullObjI extends AccessTokenI {
	lastPages?: string[];
}
