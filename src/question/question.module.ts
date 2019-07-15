import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionService } from './question.service';
import { AnswerService } from './answer.service';
import { QuestionResolver } from './question.resolver';
import { TopicModule } from '../topic/topic.module';
import { Question, Answer, QuestionAnswer } from './question.entity';
@Module({
    imports: [ 
        TypeOrmModule.forFeature([Question, Answer, QuestionAnswer]),
        TopicModule,
    ],
    providers: [
        QuestionService,
        AnswerService,
        QuestionResolver
    ],
    exports: [
        QuestionService,
        AnswerService,
    ],
})
export class QuestionModule {}