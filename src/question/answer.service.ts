import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionEntity, QuestionAnswerEntity } from 'kuis-dharma-database';
import { Answer } from './question.dto';
import { QuestionTransformer } from './question.transformer';

@Injectable()
export class AnswerService {
    constructor(
        @InjectRepository(QuestionEntity)
        private readonly question_repository: Repository<QuestionEntity>,
        @InjectRepository(QuestionAnswerEntity)
        private readonly qa_entity: Repository<QuestionAnswerEntity>,
        private readonly question_transformer: QuestionTransformer,
    ) {}

    async findByQuestion( question_id: string ): Promise<Answer[]> {
        try {
            const question = await this.question_repository.findOne( question_id );
            if ( !question ) throw new NotFoundException('question was not found');
            const answers = await this.qa_entity.find({
                where: {
                    question,
                },
                relations: ['answer'],
            });
            return answers.map( ( entity: QuestionAnswerEntity ) => this.question_transformer.toAnswer( entity.answer ) );
        } catch ( error ) {
            throw error;
        }
    }
}