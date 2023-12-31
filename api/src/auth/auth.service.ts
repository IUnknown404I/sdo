import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotValidDataError } from 'errors/NotValidDataError';
import { ErrorMessages } from 'guards';
import logapp from 'utils/logapp';
import { getToday } from '../../utils/date-utils';
import { AccessTokenPayload, User } from '../users/users.schema';
import { UserIdentWithEmailPayload, UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(private userService: UsersService, private jwtService: JwtService) {}

	/**
	 * @IUnknown404I Exec all login&auth logic for the passed request;
	 * @param payload  as username or email and password for logining and fingerprints for meta update;
	 * @returns all auth data for client-side.
	 */
	async login(payload: {
		username: string;
		password: string;
		email?: string;
		fingerprints?: string;
	}): Promise<{ access_token: string; refresh_token: string; expires_in: Date }> {
		// search and check for the appropriate user in db
		const user =
			payload.username === 'DisabledValue*0' || payload.username === '' || !payload.username
				? ((await this.userService.findUserByEmail(payload.email, true)) as User & { _id: string; __v: string })
				: ((await this.userService.findUser({ username: payload.username, secret: true })) as User & {
						_id: string;
						__v: string;
				  });
		if (!user) throw new UnauthorizedException();

		// complex validating userData, exec fail-login-actions if something wrong
		if ((await this.userService.validateUser({ user, password: payload.password })) === false)
			await this.loginFailedAction(user.username);
		else {
			// all OK. Getting auth data, updating logs and meta and return tokens.
			if (payload.fingerprints !== undefined)
				this.userService.updateUserFingerprints({
					ident: { username: user.username },
					fingerprints: payload.fingerprints,
				});

			const newTokens = await this.createTokens(user);
			const today = getToday();
			const newUserDate = `${today.today} ${today.time}`;

			this.userService.updateUserRequestsLogs({
				username: user.username,
				decision: '[logged-in]',
				lastRequest: '/auth/login-in',
			});
			this.userService.clearFailedAttempts({ username: user.username });
			this.userService.updateLastLoginInDate({ username: user.username, newValue: newUserDate });
			if (!!user.recoveryToken && user.recoveryToken !== 'none')
				this.userService.updateRecoveryTokenValue({ username: user.username, newToken: 'none' });
			return newTokens;
		}
	}

	/**
	 * @IUnknown404I Exec all logic duo auth errors, send res with the approptiate text.
	 * @param username as string value.
	 */
	private async loginFailedAction(username: string): Promise<void> {
		const { failedAttempts, lastLoginIn } = (await this.userService.findUser({ username, secret: true })) as User;
		this.userService.updateUserRequestsLogs({
			username,
			decision: false,
			lastRequest: '/auth/login-in',
		});

		// if user not found
		if (failedAttempts === undefined || lastLoginIn === undefined) throw new NotValidDataError();

		// 5 attempts, after blocks the user. Returns error with available attempts count.
		if (failedAttempts) {
			if (failedAttempts === 4) {
				this.userService.blockUser({ username });
				this.userService.incFailedAttempts({ username });
				throw new UnauthorizedException('Ваш аккаунт был заблокирован! Причина: подозрительная активность.');
			}

			this.userService.incFailedAttempts({ username });
			throw new UnauthorizedException(`${ErrorMessages.AUTH_ERROR} Attempts left: ${4 - failedAttempts}`);
		} else {
			this.userService.incFailedAttempts({ username });
			throw new UnauthorizedException(`${ErrorMessages.AUTH_ERROR} Attempts left: ${4 - failedAttempts}`);
		}
	}

	/**
	 * @IUnknown404I creates access and refresh tokens with date-expiration of access_token string value;
	 * @param userData as full user Object from db;
	 * @returns fresh auth tokens and expiration_field for the user.
	 */
	async createTokens(
		userData: User & { _id: string },
	): Promise<{ access_token: string; refresh_token: string; expires_in: Date }> {
		// manually setting attributes to ignore over-extending attributes
		const tokenPayload: AccessTokenPayload = {
			username: userData.username,
			email: userData.email,
			isActive: userData.isActive,
			isBlocked: userData.isBlocked,
			blockReason: userData.blockReason,
			lastLoginIn: userData.lastLoginIn,
			failedAttempts: userData.failedAttempts,
			createdAt: userData.createdAt,
			lastFingerprints: userData.lastFingerprints,
		};

		const access_token = this.jwtService.sign(tokenPayload, {
			secret: process.env.JWT_SECRET,
			expiresIn: `${60 * 3}s`,
		});
		const refresh_token = this.jwtService.sign(
			{
				userID: userData._id,
				isBlocked: userData.isBlocked,
				lastLoginIn: userData.lastLoginIn,
			},
			{
				secret: process.env.JWT_REFRESH_SECRET,
				expiresIn: `${60 * 60 * 24 * 1}s`,
			},
		);

		// setting new tokens, expiration for 3 mins and update users' logs.
		const today = getToday();
		const newUserDate = `${today.today} ${today.time}`;
		this.userService.updateActiveRefreshToken({ username: userData.username, newToken: refresh_token });
		this.userService.updateLastModifiedDate({ username: userData.username, newValue: newUserDate });
		return {
			access_token,
			refresh_token,
			expires_in: new Date(new Date().setMinutes(new Date().getMinutes() + 3)),
		};
	}

	/**
	 * @IUnknown404I refresh the access_token and update userData by refresh_token;
	 * @param refreshToken as string of the token value;
	 * @param fingerprints as string of request.headers[user-agent] attribute of requests;
	 * @returns new tokens (auth data) for the requested user;
	 */
	async refreshAccessTokenByRefreshToken(
		refreshToken: string,
		fingerprints?: string,
	): Promise<{ access_token: string; refresh_token: string; expires_in: Date }> {
		const userData = await this.userService.findByRefreshToken(refreshToken);
		const updateLogs = async (urlPath: string, decision: boolean | string) =>
			await this.userService.updateUserRequestsLogs({
				username: userData.username,
				decision: decision,
				lastRequest: urlPath,
			});

		// validates the passed token duo user-data (if found);
		// and updates user's logs and meta, send error or fresh tokens for auth on client-sied.
		if (
			userData.activeRefreshToken !== refreshToken ||
			(await this.validateToken(refreshToken, true)) === false ||
			(await this.userService.validateUser({ user: userData as User & { _id: string; __v: string } })) === false
		) {
			await updateLogs('/auth/refresh-token', false);
			throw new NotValidDataError();
		} else await updateLogs('/auth/refresh-token', true);

		if (fingerprints !== undefined)
			this.userService.updateUserFingerprints({ ident: { username: userData.username }, fingerprints });
		return await this.createTokens(userData);
	}

	/**
	 * @IUnknown404I Validates refresh or access tokens.
	 * @param token as string of the token-value
	 * @param isRefreshToken boolean flag for refresh_token to be validated, not access_token;
	 * @param ignoreExpiration boolean flag for ignore date expiration of passed token;
	 * @returns boolean if calculations ok, Object either.
	 */
	async validateToken(
		token: string,
		isRefreshToken: boolean = false,
		ignoreExpiration: boolean = false,
	): Promise<boolean | object> {
		// refresh_token Object check to be passed
		if (!isRefreshToken) {
			const decodedToken = await this.jwtService.decode(token);
			// edge case processing of pre-configured request from server be sent -> sending 401 error with reauth request
			if (typeof decodedToken !== 'object') throw new UnauthorizedException(ErrorMessages.REAUTH_REQIRED);
			// blocked states guard
			else if (!('isBlocked' in decodedToken) || decodedToken.isBlocked)
				throw new UnauthorizedException(ErrorMessages.ACCESS_ERROR);
		}

		try {
			return isRefreshToken
				? await this.jwtService.verify(token, {
						secret: process.env.JWT_REFRESH_SECRET,
				  })
				: await this.jwtService.verify(token, {
						secret: process.env.JWT_SECRET,
				  });
		} catch (err) {
			if (ignoreExpiration) return false;
			else throw new UnauthorizedException(ErrorMessages.REAUTH_REQIRED);
		}
	}

	/**
	 * @IUnknown404I creates user if passed data is valid.
	 * @returns UserI or an custom DataError.
	 */
	async registration(payload: {
		username: string;
		password: string;
		email: string;
		company?: string;
		activatedUser?: boolean;
	}) {
		const userDTO = {
			username: payload.username,
			password: payload.password,
			email: payload.email,
			company: payload.company || 'Не указано',
			activatedUser: payload.activatedUser,
		};
		return await this.userService.createOne(userDTO);
	}

	async getUserByRefreshToken(refresh_token: string) {
		if (!refresh_token) throw new NotValidDataError();
		return await this.userService.findByRefreshToken(refresh_token);
	}

	async getUserLastPage(payload: UserIdentWithEmailPayload): Promise<string[]> {
		return await this.userService.getUserLastPage(payload);
	}
}
