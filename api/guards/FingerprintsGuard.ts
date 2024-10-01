import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessTokenPayload, User } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FingerprintsGuard implements CanActivate {
	constructor(private readonly usersService: UsersService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const accessToken = request?.headers.authorization?.split(' ')[1];
		const refreshToken = request?.cookies?.refreshToken;
		const requestFingerprints = request?.headers['user-agent'];

		if ((!refreshToken && !accessToken) || !requestFingerprints)
			throw new UnauthorizedException('Не предоставлены идентификаторы пользователя!');

		// if already got guard-processed user data, use it. Either do check for the validity of the data
		const requestedUser =
			!!request.guardUserData && 'username' in request.guardUserData && '_systemrole' in request.guardUserData
				? (request.guardUserData as Omit<User, '_id'>)
				: refreshToken
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
}
