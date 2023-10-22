import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessages } from 'guards';
import { AccessTokenPayload } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../src/auth/auth.service';

@Injectable()
export class RefreshOrAccessTokenGuard extends AuthGuard('jwt') implements CanActivate {
	constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const accessToken = request?.headers.authorization?.split(' ')[1];
		const refreshToken = request?.cookies?.refreshToken;

		if (!refreshToken && !accessToken)
			throw new UnauthorizedException('Не предоставлены идентификаторы пользователя!');

		const requestedPath =
			context.switchToHttp().getRequest().url || context.switchToHttp().getRequest().path || 'undefined';
		const requestedUser = refreshToken
			? await this.usersService.findByRefreshToken(refreshToken)
			: ((await this.usersService.decodeJWT(accessToken)) as AccessTokenPayload);
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
		const userValidation = await this.usersService.validateUser(requestedUser);
		userDecision = (typeof userValidation === 'object' && 'username' in userValidation) || false;

		// updating history and send decision
		if (requestedPath !== '/users/leave-meta')
			this.usersService.updateUserRequestsLogs({
				username: requestedUser.username,
				decision: tokenDecision && userDecision,
				lastRequest: requestedPath,
			});
		if (!tokenDecision || !userDecision) throw new UnauthorizedException(ErrorMessages.AUTH_ERROR);
		else return true;
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
