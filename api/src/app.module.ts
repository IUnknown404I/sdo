import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AccessLevelGuard } from 'guards/AccessLevelGuard';
import { IPProccederGuard } from 'guards/IPProccederGuard';
import { RefreshOrAccessTokenGuard } from 'guards/RefreshOrAccessTokenGuard';
import { SystemRolesGuard } from 'guards/SystemRolesGuard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { CourseProgressModule } from './course-progress/course-progress.module';
import { CoursesModule } from './courses/courses.module';
import { DocumentsModule } from './documents/documents.module';
import { EmailModule } from './email/email.module';
import { FilesModule } from './files/files.module';
import { GlobalGroupsModule } from './global-groups/global-groups.module';
import { LecturesModule } from './lectures/lectures.module';
import { MediasModule } from './medias/medias.module';
import { QuestionsModule } from './questions/questions.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { ScormsModule } from './scorms/scorms.module';
import { SystemModule } from './system/system.module';
import { TestRunsModule } from './test-runs/test-runs.module';
import { TestsModule } from './tests/tests.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		EventEmitterModule.forRoot({
			delimiter: '.',
			maxListeners: 100,
			removeListener: false,
			ignoreErrors: false,
		}),
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
		ScormsModule,
		DocumentsModule,
		LecturesModule,
		MediasModule,
		TestsModule,
		QuestionsModule,
		GlobalGroupsModule,
		CourseProgressModule,
		RedisCacheModule,
		TestRunsModule,
		SystemModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: IPProccederGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RefreshOrAccessTokenGuard,
		},
		{
			provide: APP_GUARD,
			useClass: AccessLevelGuard,
		},
		{
			provide: APP_GUARD,
			useClass: SystemRolesGuard,
		},
		AppService,
	],
})
export class AppModule {}
