import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ErrorMessages } from 'guards';
import { Strategy } from 'passport-local';
import { UsersAuthService } from 'src/users/users-auth-service';
import { getToday } from '../../../utils/date-utils';
import { UsersService } from '../../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private userService: UsersService,
		private userAuthService: UsersAuthService,
	) {
		super();
	}

	async validate(username: string, password: string): Promise<any> {
		const user = await this.userAuthService.validateUser({ username, password });
		if (!user) {
			await this.userAuthService.incFailedAttempts({ username });
			throw new UnauthorizedException(ErrorMessages.AUTH_ERROR);
		}

		const today = getToday();
		const newUserDate = `${today.today} ${today.time}`;
		this.userService.updateLastLoginInDate({ username, newValue: newUserDate });
		this.userAuthService.clearFailedAttempts({ username });

		return user;
	}
}

export class LocalAuthGuard extends AuthGuard('local') {}
