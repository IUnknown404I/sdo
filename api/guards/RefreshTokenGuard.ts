import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { NotValidDataError } from 'errors/NotValidDataError';
import { ErrorMessages } from 'guards';
import { PublicRoute } from 'metadata/metadata-decorators';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../src/auth/auth.service';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt') implements CanActivate {
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
		const refreshToken = request?.cookies?.refreshToken;
		if (!refreshToken) throw new NotValidDataError('Не предоставлен ключ восстановления!');

		const decision = !!(await this.authService.validateToken(
			typeof refreshToken === 'string' ? refreshToken : '',
			true,
		));

		if (decision) {
			// add to request's payload user-data to use in handlers
			request['guardUserData'] = await this.usersService.findByRefreshToken(refreshToken);
			// pass the request
			return true;
		}
		throw new UnauthorizedException(ErrorMessages.AUTH_ERROR);
	}

	async activate(context: ExecutionContext): Promise<boolean> {
		return super.canActivate(context) as Promise<boolean>;
	}

	handleRequest(err: any, user: any) {
		if (err || !user) {
			throw new UnauthorizedException(ErrorMessages.AUTH_ERROR);
		}
		return user;
	}
}
