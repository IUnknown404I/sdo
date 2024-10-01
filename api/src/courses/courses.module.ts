import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { Chat, chatSchema } from 'src/chat/chat.schema';
import { ChatService } from 'src/chat/chat.service';
import { CourseProgress, courseProgressSchema } from 'src/course-progress/course-progress.schema';
import { CourseProgressService } from 'src/course-progress/course-progress.service';
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
import { CoursesContentController } from './courses-content.controller';
import { CoursesContentService } from './courses-content.service';
import { CoursesGroupsController } from './courses-groups.controller';
import { CoursesGroupsService } from './courses-groups.service';
import { CoursesPublicController } from './courses-public.controller';
import { CoursesReportsController } from './courses-reports.controller';
import { CoursesReportsService } from './courses-reports.service';
import { CoursesController } from './courses.controller';
import { Course, coursesSchema } from './courses.schema';
import { CoursesService } from './courses.service';

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
	controllers: [
		CoursesPublicController,
		CoursesGroupsController,
		CoursesController,
		CoursesContentController,
		CoursesReportsController,
	],
	providers: [
		CoursesService,
		CoursesGroupsService,
		CoursesContentService,
		CoursesReportsService,
		AuthService,
		UsersService,
		UsersAuthService,
		UsersFriendsService,
		GlobalGroupsService,
		CourseProgressService,
		TestsService,
		TestRunsService,
		QuestionsService,
		ChatService,
	],
	exports: [CoursesService, CoursesGroupsService],
})
export class CoursesModule {}
