import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { uid } from 'uid';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.schema';

@Injectable()
export class EmailService {
	constructor(
		// @Inject(forwardRef(() => UsersService))
		private jwtService: JwtService,
		private readonly mailerService: MailerService,
	) {}

	// private mailBasicConf = {
	//     to: process.env.MAIL_USER_FULL,
	//     from: process.env.MAIL_USER_FULL,
	//     self: process.env.MAIL_SELF_FULL,
	//     study: process.env.MAIL_STUDY_REQUEST_FULL,
	// }

	async createEmailToken(): Promise<string> {
		return uid(64);
	}

	async sendEmailVerification(email: string, token: string) {
		const tokenLink = `https://api.sdo.rnprog.ru/email/validate/${token}`;
		return await this.mailerService
			.sendMail({
				to: [email.trim()],
				from: process.env.MAIL_USER_FULL,
				subject: `[Подтверждение аккаунта] Активируйте созданную учетную запись на образовательной платформе!`,
				text: 'Подтверждение аккаунта',
				html: `
                    <h2>Вам необходимо активировать учётную запись!</h2>
                    <p>Чтобы начать пользоваться образовательной платформой научно-образовательного центра Газпром межрегионгаз инжиниринг, необходимо перейти по указанной ниже ссылке</p>
                    <a title="Активировать аккаунт" href={tokenLink}>{tokenLink}</a>
                    <br/>
                    <p>Если это были не вы или письмо пришло к вам ошибочно, просто проигнорируйте его.</p>
                    <p>По любым вопросам Вы всегда можете связаться с нами по указанным на нашем сайте контактам: <a title="Контакты НОЦ" href="https://umcmrg.ru/contacts">https://umcmrg.ru/contacts</a></p>
                `,
			})
			.then(res => res)
			.catch(err => err);
	}
}
