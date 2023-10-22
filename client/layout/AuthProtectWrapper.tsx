import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import React from 'react';
import { notification } from '../components/utils/notifications/Notification';
import useLoading from '../hooks/useLoading';
import { LoginFullObjI, rtkApi } from '../redux/api';
import { useTypedDispatch, useTypedSelector } from '../redux/hooks';
import { clearAccessToken } from '../redux/slices/accessToken';
import { setAuthState } from '../redux/slices/auth';
import { clearBearer } from '../redux/slices/axiosInstance';
import { clearUserData } from '../redux/slices/user';
import AuthThunks from '../redux/thunks/auth';
import { checkTokenValidityWithDate } from '../utils/http';
import logapp from '../utils/logapp';
import AppDataSubscriber from './AppDataSubscriber';

const ALLOWED_PATHS: string[] = [
	'login',
	'registration',
	'recovery',
	'replacement',
	'refresh-token',
	'password-rewrite',
	'error',
	'404',
];
/**@deprecated */
const allowedURIPaths = {
	upper: ['login', 'registration', 'recovery', 'refresh-token', 'password-rewrite', '404'],
	inner: ['error', 'recovery'],
};

/**
 * AuthProtectWrapper with authenticate, authorize, auto-refreshes and e.t.c. logic inside.
 * @param {JSX.Element | JSX.Element[]} children as inherited nodes.
 * @returns a protected wrapper with all auth logic for use across the application.
 */
const AuthProtectWrapper = (props: { children: JSX.Element | JSX.Element[] }): JSX.Element => {
	const theme = useTheme();
	const router = useRouter();
	const dispatch = useTypedDispatch();

	const auth = useTypedSelector(state => state.auth.state);
	const userDTO = useTypedSelector(state => state.user);
	const accessTokenDTO = useTypedSelector(state => state.accessToken);
	const axiosInstance = useTypedSelector(state => state.axiosInstance?.instance);

	const isFetching = React.useRef<boolean>(false);
	const [cookiesClearReq, _mutationData] = rtkApi.useClearCookiesMutation();

	const { Loader } = useLoading({
		size: 50,
		value: 25,
		disableShrink: false,
		animationDuration: '2.5s',
	});
	const { Loader: SecondLoader } = useLoading({
		size: 64,
		value: 100,
		disableShrink: false,
		animationDuration: '2.5s',
	});
	const { Loader: ThirdLoader } = useLoading({
		size: 50,
		value: 25,
		disableShrink: false,
		animationDuration: '2.5s',
	});

	React.useEffect(() => {
		if (isFetching.current) return;
		isFetching.current = true;

		new Promise<void>((resolve, reject) => {
			// force redirect from auth forms to app if user already logged-in
			if (auth && (router.route === '/login' || router.route === '/registry' || router.route === '/recovery')) {
				if (checkAuthValidity()) {
					redirectToApp();
					resolve();
				}
			}
			const isPublicRoute = checkUrlPath(router.asPath);

			// public route --> revalidating
			if (isPublicRoute && (!auth || !checkAuthValidity())) refreshLogic();
			// not auth and private data requested --> refreshing
			else if (!auth && !isPublicRoute) refreshLogic();
			// auth and private data --> revalidating
			// else if (auth && !isPublicRoute && !checkAuthValidity()) redirectToLoginPage();
			else if (auth && !isPublicRoute && !checkAuthValidity()) refreshLogic();

			resolve();
		}).finally(() => (isFetching.current = false));
	}, [auth, router.asPath]);

	if (auth || (!auth && checkUrlPath(router.asPath)))
		return auth ? (
			<AppDataSubscriber>
				{Array.isArray(props.children) ? props.children.map(el => el) : props.children}
			</AppDataSubscriber>
		) : (
			<>{Array.isArray(props.children) ? props.children.map(el => el) : props.children}</>
		);
	else
		return (
			<Box
				sx={{
					position: 'absolute',
					inset: '0 0',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '1.25rem',
					backgroundColor: theme => (theme.palette.mode === 'light' ? '#ffffff' : '#162433'),
				}}
			>
				<Box
					sx={{
						position: 'relative',
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						gap: '1.5rem',
					}}
				>
					{Loader} {SecondLoader} {ThirdLoader}
				</Box>
			</Box>
		);

	/**
	 * @IUnknown404I
	 * Check the validity of auth state by listing userDTO and validating access-token attributes.
	 */
	function checkAuthValidity(): boolean {
		try {
			if (
				!!!userDTO ||
				!(!!userDTO.username && !!userDTO.email) ||
				!!!accessTokenDTO ||
				!!!accessTokenDTO.access_token ||
				!checkTokenValidityWithDate({
					access_token: accessTokenDTO.access_token,
					expires_in: accessTokenDTO.expires_in,
				})
			) {
				logapp.log('[error] checkAuthValidity FAILED');
				// refreshLogic();
				return false;
			} else {
				logapp.log('[ok] checkAuthValidity is OK');
				return true;
			}
		} catch (e) {
			return false;
		}
	}

	/**
	 * @IUnknown404I
	 * Refresh auth, session and tokens states on fullfilled state duo session state to "expired" and redirecting to the login page.
	 */
	function refreshLogic(): void {
		dispatch(AuthThunks.fetchAndUpdateTokens())
			.then(unwrapResult)
			.then(data => {
				logapp.info('AUTH WRAPPER -> thunk works good, result = ', data);
				if (typeof data !== 'object' || ('name' in data && data.name === 'AxiosError')) redirectToLoginPage();
				else {
					logapp.info(data as LoginFullObjI);
					axiosInstance
						.put('users/leave-meta', { lastPage: router.asPath })
						.then(res =>
							logapp.log(
								'[#AuthProtectWrapper - Metadata sending]: successfully sent data, got response = ',
								res,
							),
						)
						.catch(e =>
							logapp.log('[#AuthProtectWrapper - Metadata sending]: cant send info, got the err: ', e),
						);
				}
			})
			.catch(() => {
				logapp.info('AUTH WRAPPER -> thunk returned an error!');
				redirectToLoginPage();
			});
	}

	/**
	 * @IUnknown404I
	 * Redirecting to the login page with signing out and clearing tokens if needed. Also the auth-warn toast will occure.
	 */
	function redirectToLoginPage(): void {
		if (!checkUrlPath(router.asPath)) {
			cookiesClearReq.call('', '');
			dispatch(clearUserData());
			dispatch(clearBearer());
			dispatch(clearAccessToken());
			if (auth) dispatch(setAuthState(false));

			router.push('/login').then(async () =>
				setTimeout(() => {
					const message = 'Вы не авторизованы! Войдите в систему для доступа к запрошенному ресурсу.';
					const displayedToasts = document?.querySelectorAll('.Toastify__toast');
					let isDublicate = false;

					if (displayedToasts.length)
						displayedToasts.forEach(toast =>
							toast.innerHTML.includes(message) ? (isDublicate = true) : {},
						);

					logapp.log('[%] found Toast dublicate. Aborting notification.');
					if (!isDublicate)
						notification({
							message,
							type: 'error',
							autoClose: 6000,
							theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
						});
				}, 1000),
			);
		}
	}

	/**
	 * @IUnknown404I
	 * If provided URI is in public zone, will return "true", for inner views - "false".
	 * @param uri current page's full urlPath or in '/[path_after_domain]' syntaxis.
	 * @returns boolean flag is in public zone.
	 */
	function checkUrlPath(uri: string): boolean {
		const splittedURI = (uri.startsWith('/') ? uri.slice(1) : uri)
			.split('/')
			.map(el => (el.includes('?') ? el.slice(0, el.indexOf('?')) : el));
		return splittedURI.reduce((flag, cur) => flag && ALLOWED_PATHS.includes(cur), true);
	}

	function redirectToApp(): void {
		router.push('/').then();
	}
};

export default AuthProtectWrapper;
