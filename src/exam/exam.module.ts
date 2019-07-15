import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam, Work } from './exam.entity';
import { ExamService } from './exam.service';
import { ExamResolver } from './exam.resolver';
import { QuestionModule } from '../question/question.module';

@Module({
    imports: [ 
        TypeOrmModule.forFeature([Exam, Work]),
        QuestionModule,
    ],
    providers: [
        ExamService,
        ExamResolver,
    ],
})
export class ExamModule {}