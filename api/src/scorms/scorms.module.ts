import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { User, userSchema } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { ScormsController } from './scorms.controller';
import { Scorm, scormsSchema } from './scorms.schema';
import { ScormsService } from './scorms.service';

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{
					name: Scorm.name,
					schema: scormsSchema,
				},
			],
			'onyxDB',
		),
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
	],
	controllers: [ScormsController],
	providers: [ScormsService, AuthService, UsersService],
})
export class ScormsModule {}
