import { FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/dist/query';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { ParsedUrlQuery } from 'querystring';
import { AccessTokenI } from '../redux/slices/accessToken';
import { AccessTokenPayload } from '../redux/slices/user';

export const allowedReqPaths = {
	upper: ['login-in', 'registration', 'clear-cookies', 'refresh-token', 'recovery', 'password-rewrite'],
	inner: ['error'],
};

/**
 * @IUnknown404I Checks passed urlPath for public access.
 * @param uri equal full or dynamic [string].
 * @returns [boolean] as isPublic uri.
 */
export const allowedReqURICheck = (uri: string): boolean => {
	if (!uri) return false;
	const lastEl: string | undefined = uri.split('/').slice(-1)[0];
	const preLastEl: string | undefined = uri.split('/').slice(-2)[0];
	return preLastEl
		? allowedReqPaths.upper.includes(preLastEl) && allowedReqPaths.inner.includes(lastEl.split('?')[0])
		: allowedReqPaths.upper.includes(lastEl.split('?')[0]);
};

interface CheckForRefreshNeedI {
	res: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>;
	extra: boolean;
	callback?: () => boolean;
}
/**
 * @IUnknown404I
 * Check responce for re-fetch purposes.
 * @param res as response.
 * @param callback as Function which returns boolean and will be fired as validation rule if were passed.
 * @returns [boolean] parameter as necessity.
 */
export const checkResponseForRefreshNeed = (payload: CheckForRefreshNeedI): boolean =>
	!!payload.res.error &&
	payload.res.error.status === 401 &&
	(payload.res.error.data === 'Reauth reqired!' ||
		((payload.res.error.data as { message: string }).message as string) === 'Reauth reqired!') &&
	(payload.extra === undefined ? true : payload.extra) &&
	(payload.callback ? payload.callback() : true);

export const authInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_SERVER,
	withCredentials: true,
	headers: {
		'Access-Control-Allow-Credentials': 'true',
		'access-control-allow-origin': '*',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization',
	},
});

export const axiosBaseOptions = {
	// baseUrl: process.env.NEXT_PUBLIC_SERVER,
	withCredentials: true,
	headers: {
		'Access-Control-Allow-Credentials': 'true',
		'access-control-allow-origin': '*',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization',
	},
};

/**
 * @IUnknown404I
 * @param token as pure token [string] or as [object] with token and expiration data.
 * @returns [boolean] as validity of passed data.
 */
export const checkAccessTokenValidity = (token: string | AccessTokenI): boolean => {
	if (!token || (typeof token === 'object' && (!token.access_token || !token.expires_in))) return false;
	const tokenValidity =
		new Date(
			parseInt(
				(
					jwt_decode(
						typeof token === 'string' ? token : (token.access_token as string),
					) as AccessTokenPayload & {
						iat: string;
						exp: string;
					}
				).exp,
			) * 1000,
		) > new Date();

	const dateValidity = typeof token === 'string' ? true : new Date(token.expires_in as string) > new Date();
	return tokenValidity && dateValidity;
};

/**
 * @IUnknown404I
 * @param token is AccessTokenI object with access_token and expires_in date. Checks validity of both parameters.
 * @returns boolean paramets: [true] for valid data and [false] otherwise
 */
export function checkTokenValidityWithDate(token: AccessTokenI): boolean {
	if (!token || (typeof token === 'object' && (!token.access_token || !token.expires_in))) return false;
	return checkAccessTokenValidity(token) && new Date(token.expires_in as string) > new Date();
}

type QuerySwitcherT = {
	(queryName: string, queryCases: string, queryObj: ParsedUrlQuery): boolean;
	(queryName: string, queryCases: string[], queryObj: ParsedUrlQuery): number | undefined;
};
/**
 * @IUnknown404I This function handles incoming query and processing them according passed options.
 * @param queryName as string - name of the query that should be processed.
 * @param queryCases as string[] - cases of query values must be taken into account when processing the query.
 * @param queryObj as ParsedUrlQuery - the query attribute from Next Router object
 * @returns if find match returns the index of found query-case or otherwise returns undefined.
 */
export const querySwitcher: QuerySwitcherT = (
	queryName: string,
	queryCases: string | string[],
	queryObj: ParsedUrlQuery,
): any | undefined => {
	// existance and passed query containing
	if (!queryObj || !(queryName in queryObj)) return 0;
	// array identical queries passed validation
	const validQuery = Array.isArray(queryObj[queryName]) ? queryObj[queryName]![0] : (queryObj[queryName] as string);
	// check overload type
	if (typeof queryCases === 'string') return queryName === queryCases;
	else return queryCases.includes(validQuery) ? queryCases.indexOf(validQuery) : undefined;
};
