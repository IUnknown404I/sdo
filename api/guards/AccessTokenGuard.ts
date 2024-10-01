import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessages } from 'guards';
import { PublicRoute } from 'metadata/metadata-decorators';
import { User } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../src/auth/auth.service';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// check for non-auth flag
		const isPublicRoute = this.reflector.get(PublicRoute, context.getHandler());
		if (!!isPublicRoute) return true;

		const request = context.switchToHttp().getRequest();
		const accessToken = request?.headers.authorization?.split(' ')[1];
		if (!accessToken) throw new UnauthorizedException(ErrorMessages.AUTH_ERROR);

		const decision = !!(await this.authService.validateToken(typeof accessToken === 'string' ? accessToken : ''));

		const requestedPath = request.url || request.path || 'undefined';
		if (requestedPath !== '/users/leave-meta')
			this.usersService.updateUserRequestsLogs({
				username: ((await this.usersService.decodeJWT(accessToken)) as User).username,
				lastRequest: requestedPath,
				decision,
			});

		if (decision) {
			// add to request's payload user-data to use in handlers
			request['guardUserData'] = await this.usersService.getUserByAccessToken(accessToken);
			// pass the request
			return true;
		}
		throw new UnauthorizedException(ErrorMessages.AUTH_ERROR);
	}

	async activate(context: ExecutionContext): Promise<boolean> {
		return super.canActivate(context) as Promise<boolean>;
	}

	handleRequest(err, user) {
		if (err || !user) {
			throw new UnauthorizedException('У вас недостаточно прав для выполнения операции!');
		}
		return user;
	}
}
