import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity, QuestionAnswerEntity } from 'kuis-dharma-database';
import { QuestionService } from './question.service';
import { AnswerService } from './answer.service';
import { QuestionTransformer } from './question.transformer';
import { QuestionResolver } from './question.resolver';
import { TopicModule } from '../topic/topic.module';
@Module({
    imports: [ 
        TypeOrmModule.forFeature([QuestionEntity, QuestionAnswerEntity]),
        TopicModule,
    ],
    providers: [
        QuestionService,
        AnswerService,
        QuestionTransformer,
        QuestionResolver
    ],
    controllers: [],
})
export class QuestionModule {}