import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Topic } from '../topic/topic.entity';
import { Question, Answer, QuestionAnswer } from '../question/question.entity';
import { Exam, Work } from '../exam/exam.entity';

const ENTITIES = [
    User,
    Topic,
    Question,
    Answer,
    QuestionAnswer,
    Exam,
    Work,
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