import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../users/users.schema';

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
		PassportModule.registerAsync({
			useFactory: async () => ({ defaultStrategy: 'jwt' }),
		}),
		JwtModule.registerAsync({
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				// signOptions: { expiresIn: '300s' }
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, UsersService],
	exports: [AuthService],
})
export class AuthModule {}
