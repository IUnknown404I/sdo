import { FetchBaseQueryError, createApi } from '@reduxjs/toolkit/query/react';
import { getAuthEndpoints } from './endpoints/authEnd';
import { getChatEndpoints } from './endpoints/chatEnd';
import { getCourseElementsEndpoints } from './endpoints/courseContentEnd';
import { getCoursesGroupsEndpoints } from './endpoints/courseGroups';
import { getCourseProgressEndpoints } from './endpoints/courseProgressEnd';
import { getCoursesEndpoints } from './endpoints/coursesEnd';
import { getDocumentsEndpoints } from './endpoints/documentsEnd';
import { getGlobalGroupsEndpoints } from './endpoints/globalGroupsEnd';
import { getLectureElementsEndpoints, getLecturesEndpoints } from './endpoints/lecturesEnd';
import { getMediasEndpoints } from './endpoints/mediasEnd';
import { getQuestionsEndpoints } from './endpoints/questionsEnd';
import { getScormsEndpoints } from './endpoints/scormsEnd';
import { getSystemEndpoints } from './endpoints/systemEnd';
import { getTestRunEndpoints } from './endpoints/testRunsEnd';
import { getTestsEndpoints } from './endpoints/testsEnd';
import { getUserCourseEndpoints } from './endpoints/user-courseEnd';
import { getUserEndpoints } from './endpoints/userEnd';
import { baseQueryWithRetry } from './utils/apiUtils';

export const TAG_TYPES_RTK = [
	// system
	...[
		'System-Logo',
		'System-Registration',
		'System-TitleCopyright',
		'System-IPv4-Blacklist',
		'System-IPv6-Blacklist',
	],
	// auth
	...['Auth', 'Refresh'],
	// users
	...['User', 'Users-Search', 'Users-Loyality', 'User-Meta', 'User-Activity', 'GlobalGroups', 'GlobalGroups-Search'],
	// files
	...['Avatars'],
	// messanger
	...['Chats', 'Friends', 'UsersData'],
	// courses
	...[
		'Courses',
		'Course-Groups',
		'Course-Groups-Exact',
		'Course-Groups-Users',
		'Course-Groups-Teachers',
		'Course-Groups-Search',
		'Course-Groups-Search-Teachers',
		'Course-Groups-Search-ContentMakers',
		'Course-Groups-Search-Tutors',
		'CourseData',
		'CourseData-Sections',
		'UserCourses',
		'Course-Progress',
		'Course-Progress-Exams-Stats',
		'Courses-Search',
	],
	// scorms
	...['Scorms'],
	// documents
	...['Documents'],
	// lectures
	...['Lectures'],
	// media files
	...['MediaFiles'],
	// test-runs
	...['Test-Runs', 'Test-Runs-active'],
	// tests
	...['Tests', 'Test-questions', 'Test-structure'],
	// questions
	...['Questions', 'Question-answers', 'Questions-structure'],
] as const;
export type TagTypesRTK = (typeof TAG_TYPES_RTK)[number];

export const rtkApi = createApi({
	reducerPath: 'OnyxApi',
	baseQuery: baseQueryWithRetry({ baseUrl: process.env.NEXT_PUBLIC_SERVER, maxRetries: 1 }),
	tagTypes: TAG_TYPES_RTK,
	endpoints: build => {
		return {
			...getSystemEndpoints(build),
			...getAuthEndpoints(build),
			...getUserEndpoints(build),
			...getGlobalGroupsEndpoints(build),
			...getChatEndpoints(build),
			...getCoursesEndpoints(build),
			...getCourseElementsEndpoints(build),
			...getCoursesGroupsEndpoints(build),
			...getUserCourseEndpoints(build),
			...getCourseProgressEndpoints(build),
			...getScormsEndpoints(build),
			...getDocumentsEndpoints(build),
			...getMediasEndpoints(build),
			...getLecturesEndpoints(build),
			...getLectureElementsEndpoints(build),
			...getTestsEndpoints(build),
			...getTestRunEndpoints(build),
			...getQuestionsEndpoints(build),
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

export type OnyxApiErrorResponseType = FetchBaseQueryError & { data: ErrorResponseDataType };
export type ErrorResponseDataType = {
	error: string;
	message: string;
	statusCode: number;
};
