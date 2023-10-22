import { AuthGuard } from '@nestjs/passport';

export class LocalAuthGuard extends AuthGuard('local') {}

export class JwtAuthGuard extends AuthGuard() {}

export enum ErrorMessages {
	AUTH_ERROR = 'Not authenticated!',
	REAUTH_REQIRED = 'Reauth reqired!',
	ACCESS_ERROR = 'Not enought rights!',
}
