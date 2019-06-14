import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, In } from 'typeorm';
import { QuestionEntity, AnswerEntity, QuestionAnswerEntity } from 'kuis-dharma-database';
import { Question, ArgCreateQuestion } from './question.dto';
import { QuestionTransformer } from './question.transformer';
import { TopicService } from '../topic/topic.service';

@Injectable()
export class QuestionService {
    constructor(
        @InjectEntityManager()
        private readonly entity_manager: EntityManager,
        @InjectRepository(QuestionEntity)
        private readonly question_repository:  Repository<QuestionEntity>,
        private readonly question_transformer: QuestionTransformer,
        private readonly topic_service: TopicService,
    ) {}

    public async doExams( length: number, topic_id: string ): Promise<Question[]> {
        const topic = await this.topic_service.loadOne(topic_id.toString());
        if ( !topic ) throw new NotFoundException('topic was not found');
        const count = await this.question_repository.createQueryBuilder('count')
            .innerJoin('count.topics', 'topic', 'topic.id = :topic_id', { topic_id }).getCount();
        if ( count < length ) throw new BadRequestException('not enough questions');
        const questions = await this.question_repository.createQueryBuilder('count')
            .innerJoinAndSelect('count.topics', 'topic', 'topic.id = :topic_id', { topic_id }).getMany();
        return questions.map( ( entity ) => this.question_transformer.toQuestion( entity ) );
    }

    public async create( question_input: ArgCreateQuestion ): Promise<Question> {
        try {
            let question = new QuestionEntity();
            question.topics = await this.topic_service.loadEntityInId( question_input.topics.map( ( id ) => Number(id) ) );
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