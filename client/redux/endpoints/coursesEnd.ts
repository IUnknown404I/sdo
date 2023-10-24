import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { RetryOptions } from '@reduxjs/toolkit/dist/query/retry';
import { TagTypesRTK } from '../api';
import { CourseI, CoursePrivatePartI, CoursePublicPartI } from '../../components/pages/courses/coursesTypes';

export const getCoursesEndpoints = (
	build: EndpointBuilder<
		BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {} & RetryOptions, {}>,
		TagTypesRTK,
		'OnyxApi'
	>,
) => {
	return {
		coursesList: build.query<string[], ''>({
			query: () => ({ url: 'courses', method: 'GET' }),
			providesTags: () => [{ type: 'Courses' }],
		}),
		courseData: build.query<CourseI, string>({
			// protected endpoint
			query: (cid: string) => ({ url: `courses/${cid}`, method: 'GET' }),
			providesTags: () => [{ type: 'CourseData' }],
		}),
		coursePublicData: build.query<CoursePublicPartI, string>({
			query: (cid: string) => ({ url: `courses/${cid}/public`, method: 'GET' }),
			providesTags: () => [{ type: 'CourseData' }],
		}),
		coursePrivateData: build.query<CoursePrivatePartI, string>({
			// protected endpoint
			query: (cid: string) => ({ url: `courses/${cid}/private`, method: 'GET' }),
			providesTags: () => [{ type: 'CourseData' }],
		}),
	};
};
