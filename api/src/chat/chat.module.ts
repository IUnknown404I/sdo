import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { User, userSchema } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Chat, chatSchema } from './chat.schema';
import { ChatService } from './chat.service';

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
		MongooseModule.forFeature(
			[
				{
					name: Chat.name,
					schema: chatSchema,
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
	controllers: [ChatController],
	providers: [ChatGateway, ChatService, UsersService, AuthService],
})
export class ChatModule {}
