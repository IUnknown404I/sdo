import { Body, Controller, Post, Put, Request, Response, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegistrationAvailableGuard } from 'guards/RegistrationAvailableGuard';
import { PublicRoute } from 'metadata/metadata-decorators';
import { User } from 'src/users/users.schema';
import { cookiesConfig, withoutSaveCookiesConfig } from 'utils/cookiesConfig';
import { NotValidDataError } from '../../errors/NotValidDataError';
import { EmailValidationPipe } from '../../globalPipes/EmailValidationPipe';
import { PasswordValidationPipe } from '../../globalPipes/PasswordValidationPipe';
import { StringValidationPipe } from '../../globalPipes/StringValidationPipe';
import { UsernameValidationPipe } from '../../globalPipes/UsernameValidationPipes';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@PublicRoute()
	@Put('login-in')
	@ApiTags('Auth')
	async loginIn(
		@Request() req,
		@Response() res,
		@Body('username', StringValidationPipe) username: string,
		@Body('password', StringValidationPipe) password: string,
		@Body('email', StringValidationPipe) email?: string,
		@Body('dataSave') dataSave?: boolean,
	): Promise<{
		access_token: string;
		expires_in: string;
		lastPages?: string[];
	}> {
		//trying to login with passed data and get the tokens for the user
		const tokens = await this.authService.login({
			username: username === 'DisabledValue*0' ? '' : username,
			email: email === 'Disable@dis.no' ? '' : email,
			password,
			fingerprints: req.headers['user-agent'],
		});

		// setting cookies corresponding passed dataSave flag
		if (dataSave === true) res.cookie('refreshToken', tokens.refresh_token, cookiesConfig);
		else res.cookie('refreshToken', tokens.refresh_token, withoutSaveCookiesConfig);

		// sending tokens, expired data for access_token and visited pages from the user's last login-in date
		const responseData = {
			access_token: tokens.access_token,
			expires_in: tokens.expires_in,
			lastDayVisits: await this.authService.getUserLastPage(
				username && username !== 'DisabledValue*0' ? { username } : { email },
			),
		};
		if (!responseData.lastDayVisits) delete responseData.lastDayVisits;
		return res.send(responseData);
	}

	@UseGuards(RegistrationAvailableGuard)
	@PublicRoute()
	@Post('registry')
	@ApiTags('Auth')
	async registration(
		@Body('username', UsernameValidationPipe) username: string,
		@Body('password', PasswordValidationPipe) password: string,
		@Body('email', EmailValidationPipe) email: string,
		@Body('company') company?: string,
	) {
		const resultOfCreatingUser = await this.authService.registration({ username, password, email, company });
		return !!resultOfCreatingUser;
	}

	@Put('refresh-token')
	@ApiTags('Auth')
	async refreshAccessToken(@Response() res, @Request() req) {
		if (!req.cookies?.refreshToken) throw new NotValidDataError('Не предоставлен ключ восстановления!');
		const requestFingerprints = req.headers['user-agent'];
		const userData = await this.authService.getUserByRefreshToken(req.cookies.refreshToken);

		// check equality of fingerprints from the request and db.
		if (
			!requestFingerprints ||
			(userData.lastFingerprints ? requestFingerprints !== userData.lastFingerprints : false)
		)
			throw new UnauthorizedException(
				requestFingerprints
					? 'Попытка воспользоваться чужой сессией!'
					: 'Отсутствие идентификаторов пользователей!',
			);

		// refreshing the tokens, setting cookies and send res
		const tokens = await this.authService.refreshAccessTokenByRefreshToken(
			req.cookies.refreshToken,
			req.headers['user-agent'],
		);
		res.cookie('refreshToken', tokens.refresh_token, cookiesConfig);
		return res.send({ access_token: tokens.access_token, expires_in: tokens.expires_in });
	}

	@Put('my-role')
	@ApiTags('Auth')
	async changeUserSystemRole(
		@Request() req,
		@Response() res,
		@Body('newRole', StringValidationPipe) newRole: User['_systemRole'],
	) {
		if (!req.guardUserData) throw new UnauthorizedException();
		// collect fresh tokens
		const tokens = await this.authService.changeUserCurrentRole(
			req.guardUserData as User & { _id: string },
			newRole,
		);
		// update cookies
		res.cookie('refreshToken', tokens.refresh_token, cookiesConfig);
		// sending tokens, expired data for access_token and visited pages from the user's last login-in date
		const responseData = {
			access_token: tokens.access_token,
			expires_in: tokens.expires_in,
			lastDayVisits: await this.authService.getUserLastPage({ username: (req.guardUserData as User).username }),
		};
		if (!responseData.lastDayVisits) delete responseData.lastDayVisits;
		return res.send(responseData);
	}
}
