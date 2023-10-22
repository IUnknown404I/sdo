import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessages } from 'guards';
import { AccessTokenPayload } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FingerprintsGuard extends AuthGuard('jwt') implements CanActivate {
	constructor(private readonly usersService: UsersService) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const accessToken = request?.headers.authorization?.split(' ')[1];
		const refreshToken = request?.cookies?.refreshToken;
		const requestFingerprints = request?.headers['user-agent'];

		if ((!refreshToken && !accessToken) || !requestFingerprints)
			throw new UnauthorizedException('Не предоставлены идентификаторы пользователя!');

		const requestedUser = refreshToken
			? await this.usersService.findByRefreshToken(refreshToken)
			: ((await this.usersService.decodeJWT(accessToken)) as AccessTokenPayload);
		if (!requestedUser.username) throw new UnauthorizedException('Предоставлены неверные авторизационные данные!');
		
		if (
			(!requestFingerprints && !!requestedUser.lastFingerprints) ||
			requestFingerprints !== requestedUser.lastFingerprints
		)
			throw new UnauthorizedException('Идентификатор пользователя не прошел проверку.');
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
