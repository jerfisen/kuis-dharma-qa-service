import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as firebase_admin from 'firebase-admin';

async function bootstrap() {
	firebase_admin.initializeApp({
		credential: firebase_admin.credential.cert( require('../sassets/kuis-dharma-firebase-adminsdk-1j5uv-dda1db7735.json') ),
		storageBucket: process.env.STORAGE_BUCKET_URL,
	});

	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes( new ValidationPipe() );

	await app.listen( process.env.PORT );
}
bootstrap();
