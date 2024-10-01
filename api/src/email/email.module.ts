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
import { UsersAuthService } from 'src/users/users-auth-service';
import { UsersFriendsService } from 'src/users/users-friends.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';
import { User, userSchema } from '../users/users.schema';
import { UsersService } from '../users/users.service';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
	imports: [
		UsersModule,
		AuthModule,
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
				// signOptions: { expiresIn: '300s' }
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
					},
				},
				defaults: {
					from: `НОЦ <${process.env.MAIL_USER_FULL}>`,
				},
				template: {
					dir: process.cwd() + '/email/templates/',
					options: {
						strict: true,
					},
				},
			}),
		}),
	],
	controllers: [EmailController],
	providers: [
		EmailService,
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
		ChatService,
	],
	exports: [EmailService],
})
export class EmailModule {}
