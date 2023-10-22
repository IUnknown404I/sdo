import axios, { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import { checkAccessTokenValidity } from '../../utils/http';
import logapp from '../../utils/logapp';
import { AccessTokenI } from '../slices/accessToken';

const axiosInitialState = (bearer?: string): CreateAxiosDefaults => {
	return {
		baseURL: process.env.NEXT_PUBLIC_SERVER,
		withCredentials: true,
		headers: {
			Authorization: bearer ? bearer : '',
			'Access-Control-Allow-Credentials': 'true',
			'access-control-allow-origin': '*',
			'Access-Control-Allow-Headers':
				'Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization',
		},
	};
};

interface axiosGeneratorI {
	bearer?: string;
	setAccessToken: (props: AccessTokenI) => void;
	clearBearer: () => void;
}

/**
 * @IUnknown404I
 * @param payload with >bearer as full Authorization header string; and two functions for realize update logic by interceptor
 * @returns axios instance with Authorization header and refresh-interceptor with auto-update logic for tokens and auth states
 */
const generateAxiosInstance = (payload: axiosGeneratorI): AxiosInstance => {
	const instance = axios.create(axiosInitialState(payload.bearer));
	instance.interceptors.request.use(
		async config => {
			if (checkForRefreshNeed(config)) {
				const newTokenData: AccessTokenI = await refreshLogic(instance, payload);
				// @ts-ignore
				config.headers = {
					Authorization: newTokenData.access_token,
					'Access-Control-Allow-Credentials': 'true',
					'access-control-allow-origin': '*',
					'Access-Control-Allow-Headers':
						'Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization',
				};
			}
			return config;
		},
		e => {
			logapp.warn('[!] REFRESH INTERCEPTOR: request rejected.');
			// payload.clearBearer();
			return Promise.reject(e);
		},
	);

	return instance;
};

async function refreshLogic(instance: AxiosInstance, payload: axiosGeneratorI): Promise<AccessTokenI> {
	return await instance
		.put(`${process.env.NEXT_PUBLIC_SERVER}/auth/refresh-token`)
		.then(res => res.data as AccessTokenI)
		.then(tokenData => {
			logapp.log('[!] REFRESH INTERCEPTOR: tokens refreshed, data =', tokenData);
			payload.setAccessToken(tokenData);
			return tokenData;
		});
}

function checkForRefreshNeed(config: AxiosRequestConfig<any>): boolean {
	return !!(
		config.headers &&
		'Authorization' in config.headers &&
		config.headers.Authorization &&
		!checkAccessTokenValidity((config.headers.Authorization as string).split(' ')[1]) &&
		!config.url?.includes('/refresh-token') &&
		// !config.url?.includes('/login-in') &&
		!config.url?.includes('/clear-cookies')
	);
}

export { axiosInitialState, generateAxiosInstance };

