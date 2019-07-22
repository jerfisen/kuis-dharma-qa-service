import { Injectable } from '@nestjs/common';
import { AuthData } from '../auth/auth.user.data';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Exam, Work, Exams, ArgExam } from './exam.entity';
import { Question, Answer, QuestionAnswer } from '../question/question.entity';
import { ArgsPageInfo, PageInfo } from '../common/page.info.dto';
import { AnswerService } from '../question/answer.service';
import { QuestionService } from '../question/question.service';

@Injectable()
export class ExamService {
	constructor(
		@InjectEntityManager()
		private readonly entity_manager: EntityManager,
		@InjectRepository(QuestionAnswer)
		private readonly qa_repository: Repository<QuestionAnswer>,
		@InjectRepository(Exam)
		private readonly exam_repository: Repository<Exam>,
		@InjectRepository(Work)
		private readonly work_repository: Repository<Work>,
		private readonly answer_service: AnswerService,
		private readonly question_service: QuestionService,
	 ){}

	async saveExam( auth: AuthData, arg: ArgExam ): Promise<Exam> {
		try {
			let exam = new Exam();
			exam.user = auth.getUser();

			const works: Work[] = [];
			let corrent_answers_count = 0;
			for ( const arg_work of arg.works ) {
				const question = await this.question_service.loadOne(arg_work.question_id);
				const answer = arg_work.answer_id !== '0' ? await this.answer_service.loadOne( arg_work.answer_id ) : null;
				const qa = answer ? await this.qa_repository.findOne({ answer }) : null;
				const work = new Work();
				work.exam = exam; work.answer = answer; work.question = question; work.selected_answer = answer;
				if ( qa && qa.correct_answer ) {
					work.correct_answer = answer;
					work.is_correct = true;
					corrent_answers_count++;
				} else {
					work.correct_answer = ( await this.qa_repository.findOne( { question: question, correct_answer: true } ) ).answer;
					work.is_correct = false;
				}
				works.push(work);
			}

			await this.entity_manager.transaction( async transaction => {
				exam = await transaction.save(exam);
				await transaction.save(works);
			} );

			exam.works = works;
			exam.skor = Number( ( corrent_answers_count / works.length * 100 ).toFixed(2) );

			return exam;
		} catch ( error ) {
			throw error;
		}
	}

	async loadMany( auth: AuthData, args_page_info: ArgsPageInfo ): Promise<Exams> {
		try {
			const [exams, count] = await this.exam_repository.findAndCount({
				where: {
					user: await auth.getUser(),
				},
				order: { date: 'DESC' },
				take: +args_page_info.per_page,
				skip: ( +args_page_info.page - 1 ) * +args_page_info.per_page,
			});
			const results = new Exams();

			results.meta = new PageInfo();
			results.meta.per_page = +args_page_info.per_page;
			results.meta.page = +args_page_info.page;
			results.meta.total_result = count;
			results.meta.total_pages = count < +args_page_info.per_page ? 1 : Math.ceil( count / +args_page_info.per_page );
			results.list = await Promise.all( exams.map( async ( exam ) => await this.loadOne( exam.id ) ) );
			return results;
		} catch ( error ) {
			throw error;
		}
	}

	async loadManyAllUser( args_page_info: ArgsPageInfo ): Promise<Exams> {
		try {
			const [exams, count] = await this.exam_repository.findAndCount({
				order: { date: 'DESC' },
				take: +args_page_info.per_page,
				skip: ( +args_page_info.page - 1 ) * +args_page_info.per_page,
			});
			const results = new Exams();

			results.meta = new PageInfo();
			results.meta.per_page = +args_page_info.per_page;
			results.meta.page = +args_page_info.page;
			results.meta.total_result = count;
			results.meta.total_pages = count < +args_page_info.per_page ? 1 : Math.ceil( count / +args_page_info.per_page );
			results.list = await Promise.all( exams.map( async ( exam ) => await this.loadOne( exam.id ) ) );
			return results;
		} catch ( error ) {
			throw error;
		}
	}

	async loadOne( id: string ): Promise<Exam> {
		try {
			const exam = await this.exam_repository.findOne(id);
			const works = await this.work_repository.find({
				where: { exam },
			});

			const exam_result = new Exam();
			exam_result.id = exam.id;
			exam_result.date = exam.date;
			exam_result.works = [];

			let corrent_answers_count = 0;
			let correct_answer: QuestionAnswer = null;
			for ( const work of works ) {
				if ( work.answer ) {
					const qa = await this.qa_repository.findOne( { where: { answer: work.answer } } );
					if ( qa.correct_answer ) {
						corrent_answers_count++;
						correct_answer = qa;
					} else {
						correct_answer = await this.qa_repository.findOne( { question: qa.question, correct_answer: true } );
					}
				} else {
					correct_answer = await this.qa_repository.findOne( { question: work.question, correct_answer: true } );
				}

				const result_work = new Work();

				result_work.question = new Question();
				result_work.question.id = work.question.id;
				result_work.question.text_content = work.question.text_content;
				result_work.question.media_content = work.question.media_content;

				result_work.correct_answer = new Answer();
				result_work.correct_answer.id = correct_answer.answer.id;
				result_work.correct_answer.text_content = correct_answer.answer.text_content;
				result_work.correct_answer.media_content = correct_answer.answer.media_content;

				if ( work.answer ) {
					result_work.selected_answer = new Answer();
					result_work.selected_answer.id = work.answer.id;
					result_work.selected_answer.text_content = work.answer.text_content;
					result_work.selected_answer.media_content = work.answer.media_content;
				} else {
					result_work.selected_answer = null;
				}

				result_work.is_correct = result_work.selected_answer ? result_work.correct_answer.id === result_work.selected_answer.id : false;
				exam_result.works.push( result_work );
			}
			exam_result.skor = Number( ( corrent_answers_count / works.length * 100 ).toFixed(2) );
			return exam_result;
		} catch ( error ) {
			throw error;
		}
	}
}
