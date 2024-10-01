import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
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
import { TestRun, testRunsSchema } from 'src/test-runs/test-runs.schema';
import { TestRunsService } from 'src/test-runs/test-runs.service';
import { Test, testsSchema } from 'src/tests/tests.schema';
import { TestsService } from 'src/tests/tests.service';
import { AuthService } from '../auth/auth.service';
import { UsersAuthService } from './users-auth-service';
import { UsersCoursesController } from './users-courses.controller';
import { UsersCoursesService } from './users-courses.service';
import { UsersExportService } from './users-export.service';
import { UsersFriendsService } from './users-friends.service';
import { UsersController } from './users.controller';
import { UsersPublicController } from './users.public.controller';
import { User, userSchema } from './users.schema';
import { UsersService } from './users.service';

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{
					name: User.name,
					schema: userSchema,
				},
				{
					name: GlobalGroup.name,
					schema: globalGroupSchema,
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
	controllers: [UsersPublicController, UsersController, UsersCoursesController],
	providers: [
		UsersService,
		UsersAuthService,
		UsersFriendsService,
		UsersCoursesService,
		UsersExportService,
		AuthService,
		GlobalGroupsService,
		CoursesService,
		CoursesGroupsService,
		CourseProgressService,
		TestsService,
		TestRunsService,
		QuestionsService,
		ChatService,
	],
	exports: [UsersService, UsersAuthService, UsersFriendsService, UsersCoursesService],
})
export class UsersModule {}
