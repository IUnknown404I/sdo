import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessages } from 'guards';
import { PublicRoute } from 'metadata/metadata-decorators';
import { UsersAuthService } from 'src/users/users-auth-service';
import { UsersService } from 'src/users/users.service';
import { isProductionMode } from 'utils/utilityFunctions';
import { AuthService } from '../src/auth/auth.service';

@Injectable()
export class RefreshOrAccessTokenGuard extends AuthGuard('jwt') implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
		private readonly usersAuthService: UsersAuthService,
	) {
		super();
	}

	private extractAccessTokenFromHeader(request: Request): string | undefined {
		if (!('authorization' in request.headers)) return;
		const [type, token] = (request.headers.authorization as string).split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}

	private getRefreshToken(request: Request): string | undefined {
		if (!('cookies' in request) || !('refreshToken' in (request.cookies as object))) return;
		return (request.cookies as { refreshToken: string }).refreshToken;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// check for non-auth flag
		const isPublicRoute = this.reflector.get(PublicRoute, context.getHandler());
		if (!!isPublicRoute) return true;

		const request = context.switchToHttp().getRequest();
		const accessToken = this.extractAccessTokenFromHeader(request);
		const refreshToken = this.getRefreshToken(request);
		if (!refreshToken && !accessToken)
			throw new UnauthorizedException('Не предоставлены идентификаторы пользователя!');

		const requestedPath = request.url || request.path || 'undefined';
		const requestedUser = refreshToken
			? await this.usersService.findByRefreshToken(refreshToken)
			: await this.usersService.getUserByAccessToken(accessToken, true);
		if (!requestedUser?.username) throw new UnauthorizedException('Предоставлены неверные авторизационные данные!');

		let tokenDecision = true;
		let userDecision = true;

		// validating tokens and requested user
		if (refreshToken)
			tokenDecision = !!(await this.authService.validateToken(
				typeof refreshToken === 'string' ? refreshToken : '',
				true,
			));
		else
			tokenDecision = !!(await this.authService.validateToken(
				typeof accessToken === 'string' ? accessToken : '',
			));

		const userValidation = await this.usersAuthService.validateUser(requestedUser);
		userDecision = (typeof userValidation === 'object' && 'username' in userValidation) || false;

		// updating history and send decision
		if (
			requestedPath !== 'undefined' &&
			requestedPath !== '/users/leave-meta' &&
			!requestedPath?.startsWith('/chats/')
		)
			this.usersService.updateUserRequestsLogs({
				username: requestedUser.username,
				decision: tokenDecision && userDecision,
				lastRequest: requestedPath,
			});
		if (!tokenDecision || !userDecision) throw new UnauthorizedException(ErrorMessages.AUTH_ERROR);

		// add to request's payload user-data to use in handlers
		request['guardUserData'] = requestedUser;

		// proceed ip-collection function
		if (
			isProductionMode() &&
			process.env.PROXY_REAL_IP_HEADER in request.headers &&
			!!request.headers[process.env.PROXY_REAL_IP_HEADER]
		) {
			const realIP =
				request['realIP'] || (request.headers[process.env.PROXY_REAL_IP_HEADER] as string | undefined);
			if (!realIP) return true;
			if (!requestedUser._lastIPs.includes(realIP))
				// write the ip from request if its unique for the user
				this.usersService.updateUserIP(realIP, requestedUser);
			if (!request['realIP']) request['realIP'] = realIP;
		}

		// pass the request
		return true;
	}

	async activate(context: ExecutionContext): Promise<boolean> {
		return super.canActivate(context) as Promise<boolean>;
	}

	handleRequest(err, user) {
		if (err || !user) {
			throw new UnauthorizedException(ErrorMessages.AUTH_ERROR);
		}
		return user;
	}
}
