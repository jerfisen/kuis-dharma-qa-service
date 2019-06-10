import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as firebase_admin from 'firebase-admin';

async function bootstrap() {
	firebase_admin.initializeApp({
		credential: firebase_admin.credential.cert( require(process.env.FIREBASE_CERT_PATH) ),
		storageBucket: process.env.STORAGE_BUCKET_URL,
	});

	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes( new ValidationPipe() );

	await app.listen( process.env.PORT );
}
bootstrap();
