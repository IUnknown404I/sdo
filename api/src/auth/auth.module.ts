import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Chat, chatSchema } from 'src/chat/chat.schema';
import { ChatService } from 'src/chat/chat.service';
import { CourseProgress, courseProgressSchema } from 'src/course-progress/course-progress.schema';
import { CourseProgressService } from 'src/course-progress/course-progress.service';
import { CoursesGroupsService } from 'src/courses/courses-groups.service';
import { Course, coursesSchema } from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';
import { GlobalGroup, globalGroupSchema } from 'src/global-groups/global-groups.schema';
import { GlobalGroupsService } from 'src/global-groups/global-groups.service';
import { Question, QuestionsSchema } from 'src/questions/questions.schema';
import { QuestionsService } from 'src/questions/questions.service';
import { System, systemSchema } from 'src/system/system.schema';
import { SystemService } from 'src/system/system.service';
import { TestRun, testRunsSchema } from 'src/test-runs/test-runs.schema';
import { TestRunsService } from 'src/test-runs/test-runs.service';
import { Test, testsSchema } from 'src/tests/tests.schema';
import { TestsService } from 'src/tests/tests.service';
import { UsersAuthService } from 'src/users/users-auth-service';
import { UsersFriendsService } from 'src/users/users-friends.service';
import { User, userSchema } from '../users/users.schema';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{
					name: User.name,
					schema: userSchema,
				},
				{
					name: Course.name,
					schema: coursesSchema,
				},
				{
					name: CourseProgress.name,
					schema: courseProgressSchema,
				},
				{
					name: GlobalGroup.name,
					schema: globalGroupSchema,
				},
				{
					name: Test.name,
					schema: testsSchema,
				},
				{
					name: TestRun.name,
					schema: testRunsSchema,
				},
				{
					name: Question.name,
					schema: QuestionsSchema,
				},
				{
					name: Chat.name,
					schema: chatSchema,
				},
				{
					name: System.name,
					schema: systemSchema,
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
	providers: [
		AuthService,
		UsersService,
		UsersAuthService,
		UsersFriendsService,
		GlobalGroupsService,
		CoursesService,
		CoursesGroupsService,
		CourseProgressService,
		TestsService,
		TestRunsService,
		QuestionsService,
		ChatService,
		SystemService,
	],
	exports: [AuthService],
})
export class AuthModule {}
