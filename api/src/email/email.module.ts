import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../users/users.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		UsersModule,
		AuthModule,
		MongooseModule.forFeature(
			[
				{
					name: User.name,
					schema: userSchema,
				},
			],
			'onyxDB',
		),
		JwtModule.registerAsync({
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				// signOptions: { expiresIn: '300s' }
			}),
			inject: [ConfigService],
		}),
		MailerModule.forRootAsync({
			useFactory: () => ({
				transport: {
					host: process.env.MAIL_HOST,
					port: process.env.MAIL_PORT,
					secure: Boolean(process.env.MAIL_SECURITY),
					auth: {
						user: process.env.MAIL_USER,
						pass: process.env.MAIL_PASSWORD,
					},
				},
				defaults: {
					from: `НОЦ <${process.env.MAIL_USER_FULL}>`,
				},
				template: {
					dir: process.cwd() + '/email/templates/',
					options: {
						strict: true,
					},
				},
			}),
		}),
	],
	controllers: [EmailController],
	providers: [EmailService, UsersService, AuthService],
	exports: [EmailService],
})
export class EmailModule {}
