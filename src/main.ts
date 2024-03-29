import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle('Customer Manager API')
		.setDescription('Customer Management System')
		.setVersion('1.0')
		.build();

	app.enableCors({
		origin: process.env.ORIGINS,
	});

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, document);

	app.useGlobalPipes(
		new ValidationPipe({
			stopAtFirstError: true,
			transform: true,
			whitelist: true,
		}),
	);

	await app.listen(3000);
}
bootstrap();
