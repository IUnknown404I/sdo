import { Strategy } from 'passport-local';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { getToday } from '../../../utils/date-utils';
import { ErrorMessages } from 'guards';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private userService: UsersService) {
		super();
	}

	async validate(username: string, password: string): Promise<any> {
		const user = await this.userService.validateUser({ username, password });
		if (!user) {
			await this.userService.incFailedAttempts({ username });
			throw new UnauthorizedException(ErrorMessages.AUTH_ERROR);
		}

		const today = getToday();
		const newUserDate = `${today.today} ${today.time}`;
		this.userService.updateLastLoginInDate({ username, newValue: newUserDate });
		this.userService.clearFailedAttempts({ username });

		return user;
	}
}

export class LocalAuthGuard extends AuthGuard('local') {}
