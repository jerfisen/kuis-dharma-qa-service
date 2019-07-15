import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer, Question, QuestionAnswer } from './question.entity';

@Injectable()
export class AnswerService {
    constructor(
        @InjectRepository( Answer )
        private readonly repository: Repository<Answer>,
        @InjectRepository(Question)
        private readonly question_repository: Repository<Question>,
        @InjectRepository(QuestionAnswer)
        private readonly qa_entity: Repository<QuestionAnswer>,
    ) {}

    async findByQuestion( question_id: string ): Promise<Answer[]> {
        try {
            const question = await this.question_repository.findOne( question_id );
            if ( !question ) throw new NotFoundException('question was not found');
            const qas = await this.qa_entity.find({
                where: {
                    question,
                },
                relations: ['answer'],
            });
            return qas.map( ( entity: QuestionAnswer ) => entity.answer );
        } catch ( error ) {
            throw error;
        }
    }

    async loadOne( id: string ): Promise<Answer> {
        try {
            return await this.repository.findOne(id);
        } catch ( error ) {
            throw error;
        }
    }
}