import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './users.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthService } from '../auth/auth.service';

@Module({
	imports: [
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
						// user: process.env.MAIL_DOMAIN_USER_FULL,
						// pass: process.env.MAIL_DOMAIN_PASSWORD,
					},
				},
				defaults: {
					from: `НОЦ - Газпром межрегионгаз инжиниринг <${process.env.MAIL_USER_FULL}>`,
					// from: `НОЦ - Газпром межрегионгаз инжиниринг <${process.env.MAIL_DOMAIN_USER_FULL}>`,
				},
				template: {
					dir: process.cwd() + '/email/templates/',
					// adapter: new PugAdapter(),
					options: {
						strict: true,
					},
				},
			}),
		}),
	],
	controllers: [UsersController],
	providers: [UsersService, AuthService],
	exports: [UsersService],
})
export class UsersModule {}
