import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { FilesModule } from './files/files.module';
import { ChatModule } from './chat/chat.module';
import { CoursesModule } from './courses/courses.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			// envFilePath: '.dev.env'
		}),
		MongooseModule.forRootAsync({
			connectionName: 'onyxDB',
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>('DB_URI'),
			}),
			inject: [ConfigService],
		}),
		UsersModule,
		AuthModule,
		EmailModule,
		FilesModule,
		ChatModule,
		CoursesModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
