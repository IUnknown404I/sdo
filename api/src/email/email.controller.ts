import { Controller, Get, Param, Redirect, Response } from '@nestjs/common';
import { EmailService } from './email.service';
import { User } from '../users/users.schema';
import { AuthService } from '../auth/auth.service';

@Controller('email')
export class EmailController {
	constructor(private emailService: EmailService, private authService: AuthService) {}

	// @Get('/validate/:token')
	// @Redirect()
	// async getEmailToken(
	//     @Param() params,
	//     @Response() res,
	// ) {
	//     const result: false | User = await this.emailService.validateToken(params.token);
	//     if (result && result.username) {
	//         const tokens = await this.authService.createTokens(result as User & {'_id': string});
	//         const expiresDate = new Date();
	//         expiresDate.setDate(expiresDate.getDate() + 7);
	//
	//         res.cookie('refreshToken', tokens.refresh_token, {
	//             expires: expiresDate.toUTCString(),
	//             domain: 'sdo.rnprog.ru',
	//             path: '/',
	//             secure: true,
	//             sameSite: 'lax',
	//             maxAge: 60 * 60 * 24 * 7,
	//             httpOnly: true,
	//         });
	//         return res.redirect('https://sdo.rnprog.ru/login');
	//         // return { url: 'https://sdo.rnprog.ru/' }
	//     }
	//     else return res.redirect('https://sdo.rnprog.ru/registration');
	// }
}
