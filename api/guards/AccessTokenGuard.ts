import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessages } from 'guards';
import { User } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../src/auth/auth.service';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') implements CanActivate {
	constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const accessToken = context.switchToHttp().getRequest()?.headers.authorization?.split(' ')[1];
		if (!accessToken) throw new UnauthorizedException(ErrorMessages.AUTH_ERROR);
		const decision = !!(await this.authService.validateToken(typeof accessToken === 'string' ? accessToken : ''));

		const requestedPath =
			context.switchToHttp().getRequest().url || context.switchToHttp().getRequest().path || 'undefined';
		if (requestedPath !== '/users/leave-meta')
			this.usersService.updateUserRequestsLogs({
				username: ((await this.usersService.decodeJWT(accessToken)) as User).username,
				decision,
				lastRequest: requestedPath,
			});

		return decision;
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
