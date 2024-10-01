import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { RetryOptions } from '@reduxjs/toolkit/dist/query/retry';
import { CourseSectionAnyElementType } from '../../components/pages/courses/courseItemsTypes';
import {
	COURSES_TYPES,
	CourseAdditionalSectionType,
	CourseI,
	CoursePrivatePartI,
	CoursePublicPartI,
	CourseSectionType,
	CourseSectionTypeWithoutContent,
	FullCourseWithGroupsI,
} from '../../components/pages/courses/coursesTypes';
import { TagTypesRTK } from '../api';

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
		coursesCategories: build.query<string[], undefined>({
			query: () => ({ url: 'courses/categories', method: 'GET' }),
			providesTags: () => [{ type: 'Courses' }],
		}),
		courseData: build.query<CourseI, string>({
			// protected endpoint
			query: (cid: string) => ({ url: `courses/${cid}`, method: 'GET' }),
			providesTags: () => [{ type: 'CourseData' }],
		}),
		courseFullData: build.query<FullCourseWithGroupsI, string>({
			// protected endpoint
			query: (cid: string) => ({ url: `courses/${cid}/full`, method: 'GET' }),
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

		adminCoursesSearch: build.query<{ courses: FullCourseWithGroupsI[]; total: number }, CoursesSearchPropsType>({
			query: data => ({
				url: '/courses/advansed-search',
				method: 'POST',
				body: data,
			}),
			providesTags: () => [{ type: 'Courses-Search' }],
		}),
		courseCreate: build.mutation<{ result: true }, CourseChangeDataType>({
			query: data => ({
				url: '/courses',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'CourseData' }, { type: 'Courses-Search' }],
		}),
		courseModify: build.mutation<{ result: true }, CourseChangeDataType>({
			query: data => ({
				url: `/courses/${data.cid}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: [{ type: 'CourseData' }, { type: 'Courses-Search' }],
		}),
		coursesActivation: build.mutation<{ result: true }, { cids: string[]; isActive: boolean }>({
			query: data => ({
				url: '/courses/activate',
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: [{ type: 'CourseData' }, { type: 'Courses-Search' }],
		}),

		// SECTIONS BLOCK
		courseAdditionalSection: build.query<
			CourseSectionAnyElementType[],
			{ cid: string; addType: CourseAdditionalSectionType }
		>({
			// protected endpoint
			query: data => ({ url: `courses/${data.cid}/additional-section/${data.addType}`, method: 'GET' }),
			providesTags: () => [{ type: 'CourseData-Sections' }],
		}),
		courseExactSection: build.query<CourseSectionType, { cid: string; csid: string }>({
			// protected endpoint
			query: data => ({ url: `courses/${data.cid}/sections/${data.csid}`, method: 'GET' }),
			providesTags: () => [{ type: 'CourseData-Sections' }],
		}),
		courseSections: build.query<CourseSectionTypeWithoutContent[], string>({
			// protected endpoint
			query: (cid: string) => ({ url: `courses/${cid}/sections`, method: 'GET' }),
			providesTags: () => [{ type: 'CourseData' }],
		}),
		courseSectionCreate: build.mutation<
			{ result: true },
			{
				cid: string;
				title: string;
				duration: number;
				background?: CourseSectionTypeWithoutContent['background'];
				contentTypes?: CourseSectionTypeWithoutContent['contentTypes'];
			}
		>({
			query: data => ({
				url: `/courses/${data.cid}/sections`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [{ type: 'CourseData' }],
		}),
		courseSectionUpdate: build.mutation<
			{ result: true },
			{
				cid: string;
				csid: string;
				title: string;
				duration: number;
				background?: CourseSectionTypeWithoutContent['background'];
				contentTypes?: CourseSectionTypeWithoutContent['contentTypes'];
			}
		>({
			query: data => ({
				url: `/courses/${data.cid}/sections/${data.csid}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: [{ type: 'CourseData' }, { type: 'CourseData-Sections' }],
		}),
		courseSectionDelete: build.mutation<{ result: true }, { cid: string; csid: string }>({
			query: data => ({
				url: `/courses/${data.cid}/sections/${data.csid}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'CourseData' }],
		}),
		courseSectionMove: build.mutation<{ result: true }, { cid: string; csid: string; newOrderIndex: number }>({
			query: data => ({
				url: `/courses/${data.cid}/sections/${data.csid}/order`,
				method: 'PUT',
				body: { newOrderIndex: data.newOrderIndex },
			}),
			invalidatesTags: [{ type: 'CourseData' }, { type: 'CourseData-Sections' }],
		}),
	};
};

export type CourseChangeDataType = Pick<CourseI, 'cid' | 'icon' | 'status'> &
	Omit<CourseI['main'], 'type'> & { type: keyof typeof COURSES_TYPES };

export interface CoursesSearchPropsType {
	title?: string;
	cid?: string;
	category?: string;
	type?: keyof typeof COURSES_TYPES;
	status?: boolean;
	limit?: number;
	from?: number;
}
