import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { FileValidationMiddleware } from 'globalPipes/FileValidationPipes';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { User, userSchema } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
			}),
			inject: [ConfigService],
		}),
		MongooseModule.forFeature(
			[
				{
					name: User.name,
					schema: userSchema,
				},
			],
			'onyxDB',
		),
	],
	controllers: [FilesController],
	providers: [FilesService, UsersService, AuthService, UsersService],
})
export class FilesModule implements NestModule {
	configure(consumer: MiddlewareConsumer): any {
		consumer.apply(FileValidationMiddleware).forRoutes(FilesController);
	}
}
