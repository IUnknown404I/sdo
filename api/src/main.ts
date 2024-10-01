import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { isProductionMode } from 'utils/utilityFunctions';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: isProductionMode()
			? [
					process.env.SELF_CLIENT_DOMAIN,
					*
			  ]
			: [
					process.env.SELF_CLIENT_DOMAIN,
					*
		credentials: true,
		exposedHeaders: [*],
		methods: *,
	});
	app.use(cookieParser());

	const config = new DocumentBuilder()
		.setTitle(
			'*',
		)
		.setDescription("Representing part of server logic of NOC's LMS.")
		.setVersion('2.1.2')
		.addTag('Users')
		.addTag('Auth')
		.addTag('Chats')
		.addTag('Courses')
		.build();
	const swaggerDocument = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('*', app, swaggerDocument);

	await app.listen(*);
}

bootstrap();
