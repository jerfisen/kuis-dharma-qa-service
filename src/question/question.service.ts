import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { QuestionEntity, AnswerEntity, QuestionAnswerEntity } from 'kuis-dharma-database';
import { ArgsPageInfo } from '../common/page.info';
import { Question, Questions, ArgCreateQuestion } from './question.dto';
import { QuestionTransformer } from './question.transformer';
import { TopicService } from '../topic/topic.service';

@Injectable()
export class QuestionService {
    constructor(
        @InjectEntityManager()
        private readonly entity_manager: EntityManager,
        private readonly question_transformer: QuestionTransformer,
        private readonly topic_service: TopicService,
    ) {}

    public async findByOne( id: string ): Promise<Question> {
        return null;
    }

    public async findByMany( meta_page: ArgsPageInfo ): Promise<Questions> {
        return null;
    }

    public async create( question_input: ArgCreateQuestion ): Promise<Question> {
        try {
            let question = new QuestionEntity();
            question.topics = await this.topic_service.findEntityInId( question_input.topics.map( ( id ) => Number(id) ) );
            question.text_content = question_input.text_content;
            question.media_content = question_input.media_content;
            const answers: AnswerEntity[] = [];
            const qas: QuestionAnswerEntity[] = [];
            for ( const new_answer of question_input.answers ) {
                const answer = new AnswerEntity();
                answer.text_content = new_answer.text_content;
                answer.media_content = new_answer.media_content;
                answers.push(answer);
                const qa = new QuestionAnswerEntity();
                if ( question_input.correct_answer === new_answer.id ) {
                    qa.correct_answer = true;
                } else {
                    qa.correct_answer = false;
                }
                qa.question = question;
                qa.answer = answer;
                qas.push(qa);
            }
            await this.entity_manager.transaction( async transaction_manager => {
                question = await transaction_manager.save(question);
                await transaction_manager.save(answers);
                await transaction_manager.save(qas);
            } );
            return this.question_transformer.toQuestion(question);
        } catch ( error ) {
            throw error;
        }
    }
}