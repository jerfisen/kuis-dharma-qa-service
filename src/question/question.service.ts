import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Question, Answer, QuestionAnswer, ArgCreateQuestion } from './question.entity';
import { TopicService } from '../topic/topic.service';
import { LCG } from '../common/lcg';

@Injectable()
export class QuestionService {
    constructor(
        @InjectEntityManager()
        private readonly entity_manager: EntityManager,
        @InjectRepository(Question)
        private readonly question_repository:  Repository<Question>,
        private readonly topic_service: TopicService,
    ) {}

    public async doExams( length: number, topic_id: string ): Promise<Question[]> {
        const topic = await this.topic_service.loadOne(topic_id.toString());
        if ( !topic ) throw new NotFoundException('topic was not found');
        const count = await this.question_repository.createQueryBuilder('count')
            .innerJoin('count.topics', 'topic', 'topic.id = :topic_id', { topic_id }).getCount();
        if ( count < length ) throw new BadRequestException('not enough questions');
        const lcg = new LCG({
            seed: Math.floor( Math.random() * ( length ) ) + 1,
            modules: count,
            multiplier: 1,
            increment: 7,
        });
        const questions = await this.question_repository.createQueryBuilder('load')
            .innerJoinAndSelect('load.topics', 'topic')
            .where('topic.id = :topic_id', { topic_id })
            .orderBy('random()')
            .getMany();

        const random_questions: Question[] = [];
        for( let i = 0; i < length; ++i ) random_questions.push( questions[ lcg.random ] );
        return random_questions;
    }

    public async create( question_input: ArgCreateQuestion ): Promise<Question> {
        try {
            let question = new Question();
            question.topics = this.topic_service.loadEntityInId( question_input.topics.map( ( id ) => Number(id) ) );
            question.text_content = question_input.text_content;
            question.media_content = question_input.media_content;
            const answers: Answer[] = [];
            const qas: QuestionAnswer[] = [];
            for ( const new_answer of question_input.answers ) {
                const answer = new Answer();
                answer.text_content = new_answer.text_content;
                answer.media_content = new_answer.media_content;
                answers.push(answer);
                const qa = new QuestionAnswer();
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
            return question;
        } catch ( error ) {
            throw error;
        }
    }

    public async loadOne( id: string ) : Promise<Question> {
        try {
            return await this.question_repository.findOne(id);
        } catch ( error ) {
            throw error;
        }
    }

}