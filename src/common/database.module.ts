import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    UserEntity,
    TopicEntity,
    ExamEntity,
    QuestionEntity,
    AnswerEntity,
    ExamWorkEntity,
} from 'kuis-dharma-database';

const ENTITIES = [
    UserEntity,
    TopicEntity,
    ExamEntity,
    QuestionEntity,
    AnswerEntity,
    ExamWorkEntity,
];

@Module({
    imports: [
        process.env.DATABASE_URL ?
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: ENTITIES,
            synchronize: true,
            extra: {
                ssl: true,
            },
            logging: ['error'],
        }) :
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: ENTITIES,
            synchronize: true,
            logging: ['error'],
        }),
    ],
})
export default class DatabaseModule {}