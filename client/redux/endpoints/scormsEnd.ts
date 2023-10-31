import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { RetryOptions } from '@reduxjs/toolkit/dist/query/retry';
import { TagTypesRTK } from '../api';

export const getScormsEndpoints = (
	build: EndpointBuilder<
		BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {} & RetryOptions, {}>,
		TagTypesRTK,
		'OnyxApi'
	>,
) => {
	return {
		scormData: build.query<ScormI, string>({
			query: (scid: string) => ({ url: `scorms/${scid}/info`, method: 'GET' }),
			providesTags: () => [{ type: 'Scorms' }],
		}),
		scormsList: build.query<ScormI[], ''>({
			query: (scid: string) => ({ url: `scorms/all`, method: 'GET' }),
			providesTags: () => [{ type: 'Scorms' }],
		}),
	};
};

export type ScormTypeList = 'ispring' | 'storyline';
export interface ScormI {
	scid: string;
	status: boolean;
	type: ScormTypeList;
	title: string;
	scname: string;
	category?: string;
	size: number;
}
