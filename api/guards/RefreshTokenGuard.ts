import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotValidDataError } from 'errors/NotValidDataError';
import { ErrorMessages } from 'guards';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../src/auth/auth.service';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt') implements CanActivate {
	constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const refreshToken = context.switchToHttp().getRequest()?.cookies?.refreshToken;
		if (!refreshToken) throw new NotValidDataError('Не предоставлен ключ восстановления!');

		const decision = !!(await this.authService.validateToken(
			typeof refreshToken === 'string' ? refreshToken : '',
			true,
		));

		if (!decision) throw new NotValidDataError('Предоставлен невалидный ключ восстановления!');
		return decision;
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
