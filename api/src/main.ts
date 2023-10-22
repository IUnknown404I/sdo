import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { isProductionMode } from 'utils/utilityFunctions';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: isProductionMode()
			? ['https://sdo.rnprog.ru', 'http://188.225.10.127:4040']
			: ['https://sdo.rnprog.ru', 'http://188.225.10.127:4040', 'http://localhost:4040', 'http://localhost'],
		credentials: true,
		exposedHeaders: ['set-cookie'],
		methods: 'DELETE, PUT, PATCH, HEAD, GET, POST, UPDATE, OPTIONS',
	});
	app.use(cookieParser());

	const config = new DocumentBuilder()
		.setTitle(
			'API - Educational platform of the Engineering scientific and Educational Center. Gazprom Mezhregiongaz Engineering.',
		)
		.setDescription("Representing part of server logic of NOC's LMS.")
		.setVersion('2.1.2')
		.addTag('Users')
		.addTag('Auth')
		.addTag('Chats')
		.addTag('Courses')
		.build();
	const swaggerDocument = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('ui', app, swaggerDocument);

	await app.listen(4444);
}

bootstrap();
