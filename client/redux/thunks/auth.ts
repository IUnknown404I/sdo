import jwt_decode from 'jwt-decode';
import { checkAccessTokenValidity } from '../../utils/http';
import logapp from '../../utils/logapp';
import { AccessTokenI, LoginFullObjI } from '../api';
import { clearAccessToken, setAccessToken } from '../slices/accessToken';
import { setAuthState, setBusyState, setLastPages, setSessionState } from '../slices/auth';
import { clearBearer, setBearer } from '../slices/axiosInstance';
import { AccessTokenPayload, clearUserData, setUserDataFromPayload } from '../slices/user';
import { AsyncThunkConfig, createAppAsyncThunk } from '../utils/thunkUtils';

const isAccessToken = (obj: Object): obj is AccessTokenI => 'access_token' in obj && 'expires_in' in obj;

export const getUserPayload = (data: AccessTokenI): AccessTokenPayload =>
	jwt_decode(data.access_token) as AccessTokenPayload;

/**
 * @IUnknown404I
 * All thunks with logic for the authorization, authentication, token updates and others in Auth cluster.
 */
export default class AuthThunks {
	/**
	 * @IUnknown404I
	 * Implementing all logic for stable work on platform with correct auth, users and others states.
	 * @param payload - pass {username, pwd} object for fetching or pass {}: AccessTokenI object to skip any fetching options and start from the auth logic.
	 * @returns [string] as Error message from the server if server response is an error or authorizations runs in problem; and the [object]: AccessToken & { lastpage?: string } otherwise
	 */
	public static authorize = createAppAsyncThunk<
		string | AccessTokenI,
		LoginFullObjI | { username: string; password: string; dataSave?: boolean },
		AsyncThunkConfig
	>('auth/authorize', async (arg, thunkAPI): Promise<LoginFullObjI | string> => {
		logapp.info('[#auth/authorize thunk] triggered, got:', arg);

		let result: LoginFullObjI | string = isAccessToken(arg) ? arg : '';
		const store = thunkAPI.getState();
		const dispatcher = thunkAPI.dispatch;

		// updating store according passed access-token payload
		const dispatchSensitiveData = (tokenObj: LoginFullObjI, validate: boolean = false) => {
			if (validate && !checkAccessTokenValidity(tokenObj)) dispatcher(this.disconnect());
			if (tokenObj.lastPages) dispatcher(setLastPages(tokenObj.lastPages));

			dispatcher(setUserDataFromPayload(getUserPayload(tokenObj)));
			dispatcher(setAccessToken(tokenObj));
			dispatcher(setBearer(`Bearer ${tokenObj.access_token}`));

			if (store.auth.sessionState !== 'active') dispatcher(setSessionState('active'));
			if (!store.auth.state) dispatcher(setAuthState(true));
		};

		if (!isAccessToken(arg)) {
			const loginResult = await store.axiosInstance?.instance
				.put(`${process.env.NEXT_PUBLIC_SERVER}/auth/login-in`, arg)
				.then(res => res.data as LoginFullObjI)
				.then(tokenObj => {
					result = tokenObj;
					dispatchSensitiveData(tokenObj);
				})
				.catch(error => error.response.data.message);
			if (typeof loginResult === 'string') return loginResult;
		} else dispatchSensitiveData(arg, true);
		return result;
	});

	/**
	 * @IUnknown404I Implementing all logic for close the session, logout user and e.t.c. methods.
	 * @description Only update the redux auth-attribute, doesn't disconnect the user!
	 * @param boolean Pass [false] for session changer mode (set the sesion to "expired") and [true] for the pure logout (by default).
	 */
	public static disconnect = createAppAsyncThunk<void, boolean | void, AsyncThunkConfig>(
		'auth/disconnect',
		async (arg: void | boolean = true, thunkAPI) => {
			logapp.info('[#auth/disconnect thunk] triggered, got:', arg);

			const store = thunkAPI.getState();
			const dispatcher = thunkAPI.dispatch;

			store.axiosInstance?.instance
				.put('/users/logout')
				.then(() => {})
				.catch(() => store.axiosInstance.instance.get(`${process.env.NEXT_PUBLIC_SELF}/api/clear-cookies`))
				.finally(() => {
					dispatcher(setAuthState(false));
					dispatcher(clearUserData());
					dispatcher(setLastPages());
					dispatcher(clearBearer());
					dispatcher(clearAccessToken());

					if (arg && store.auth.sessionState !== 'closed') dispatcher(setSessionState('closed'));
					else if (!arg && store.auth.sessionState !== 'expired') dispatcher(setSessionState('expired'));
					logapp.info('[#auth/disconnect thunk] finished clearing');
				});
		},
	);

	/**
	 * @IUnknown404I This thunk is fetching new tokens and update them.
	 * @description Updates the isBusy auth's state => if already been busy stops request immediatelly.
	 * @param boolean - to save data pass [true] (by default), pass [false] for just get update refresh and get data as LoginFullObjI.
	 * @returns object: LoginFullObjI for fullfilled or undefined for error-cases.
	 */
	public static fetchAndUpdateTokens = createAppAsyncThunk<
		LoginFullObjI | 'busy' | undefined,
		boolean | void,
		AsyncThunkConfig
	>('auth/fetchAndUpdateTokens', async (arg: void | boolean = true, thunkAPI) => {
		logapp.info('[#auth/fetchAndUpdateTokens thunk] triggered, got:', arg, +new Date());

		const store = thunkAPI.getState();
		const dispatcher = thunkAPI.dispatch;

		// if auth is busy, stop immediatelly
		if (store.auth.isBusy) {
			logapp.log('[#auth/fetchAndUpdateTokens thunk canceled] auth-busy-state is already occupied');
			return 'busy';
		}
		// borrow the auth state
		dispatcher(setBusyState(true));

		return await store.axiosInstance?.instance
			.put(`${process.env.NEXT_PUBLIC_SERVER}/auth/refresh-token`)
			.then(res => res.data as LoginFullObjI)
			.then(tokenObject => {
				// update auth data, tokens and personal info
				if (arg) {
					dispatcher(setLastPages(tokenObject.lastPages));
					dispatcher(setAccessToken(tokenObject));
					dispatcher(setUserDataFromPayload(getUserPayload(tokenObject)));
					dispatcher(setSessionState('active'));
					if (!store.auth.state) dispatcher(setAuthState(true));
				}
				return tokenObject;
			})
			.catch(e => {
				// logout and check seccion state
				if (arg && store.auth.state) {
					dispatcher(setAuthState(false));
				}
				if (store.auth.sessionState === 'active') dispatcher(setSessionState('expired'));
				return undefined;
			})
			.finally(() => {
				// unoccupy the auth-busy state
				dispatcher(setBusyState(false));
			});
	});

	/**
	 * @deprecated
	 * @IUnknown404I
	 * This thunk will just replace tokens, configure Axios instance and check the user's lastPages value (if exists).
	 * @returns passed data.
	 */
	public static updateTokens = createAppAsyncThunk<LoginFullObjI, LoginFullObjI, AsyncThunkConfig>(
		'auth/updateTokens',
		async (arg, thunkAPI) => {
			logapp.info('[#auth/updateTokens thunk] triggered, got:', arg);

			if (arg) {
				if (arg.lastPages) thunkAPI.dispatch(setLastPages(arg.lastPages));
				thunkAPI.dispatch(setAccessToken(arg));
				thunkAPI.dispatch(setBearer(`Bearer ${arg.access_token}`));
				if (!thunkAPI.getState().auth.state) thunkAPI.dispatch(setAuthState(true));
				if (thunkAPI.getState().auth.sessionState !== 'active') thunkAPI.dispatch(setSessionState('active'));
			}
			return arg;
		},
	);

	/**
	 * @IUnknown404I
	 * This thunk will just send request for additional password recovery according passed user-info.
	 * @param [object] with username and email values.
	 * @returns [true] for succesfull state and [string] as Error message from the response either.
	 */
	public static additionalRecoveryRequest = createAppAsyncThunk<
		boolean | string,
		{ username: string; email: string },
		AsyncThunkConfig
	>('auth/updateTokens', async (arg, thunkAPI) => {
		logapp.info('[#auth/additionalRecoveryRequest thunk] triggered.');
		let flag: boolean | string = false;

		await thunkAPI
			.getState()
			.axiosInstance?.instance.post('/users/recovery', arg)
			.then(() => (flag = true))
			.catch(err => (flag = err.response.data.message));
		return flag;
	});
}
