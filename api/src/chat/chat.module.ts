import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CourseProgress, courseProgressSchema } from 'src/course-progress/course-progress.schema';
import { CourseProgressService } from 'src/course-progress/course-progress.service';
import { CoursesGroupsService } from 'src/courses/courses-groups.service';
import { Course, coursesSchema } from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';
import { GlobalGroup, globalGroupSchema } from 'src/global-groups/global-groups.schema';
import { GlobalGroupsService } from 'src/global-groups/global-groups.service';
import { Question, QuestionsSchema } from 'src/questions/questions.schema';
import { QuestionsService } from 'src/questions/questions.service';
import { TestRun, testRunsSchema } from 'src/test-runs/test-runs.schema';
import { TestRunsService } from 'src/test-runs/test-runs.service';
import { Test, testsSchema } from 'src/tests/tests.schema';
import { TestsService } from 'src/tests/tests.service';
import { UsersAuthService } from 'src/users/users-auth-service';
import { UsersFriendsService } from 'src/users/users-friends.service';
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
				{
					name: Chat.name,
					schema: chatSchema,
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
					name: GlobalGroup.name,
					schema: globalGroupSchema,
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
	providers: [
		ChatGateway,
		ChatService,
		UsersService,
		UsersAuthService,
		UsersFriendsService,
		AuthService,
		GlobalGroupsService,
		CoursesService,
		CoursesGroupsService,
		CourseProgressService,
		TestsService,
		TestRunsService,
		QuestionsService,
	],
	exports: [ChatGateway, ChatService],
})
export class ChatModule {}
