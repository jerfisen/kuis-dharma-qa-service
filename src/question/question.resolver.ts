import { Resolver, Args, Mutation, ResolveProperty, Parent, Query } from "@nestjs/graphql";
import { Question, Answer, ArgCreateQuestion, ArgsDoExam, ArgQuestionId } from './question.entity';
import { QuestionService } from './question.service';
import { AnswerService } from './answer.service';
import { ArgTopicId } from "../topic/topic.entity";
import { Int } from "type-graphql";

@Resolver( of => Question )
export class QuestionResolver {
    constructor(
        private readonly question_service: QuestionService,
        private readonly answer_service: AnswerService,
    ){}

    @Query( returns => [Question] )
    async doExam( @Args() args: ArgsDoExam): Promise<Question[]> {
        try {
            return await this.question_service.doExams( args.length, args.topic, args.seed );
        } catch ( error ) {
            throw error;
        }
    }

    @Query( returns => Int )
    async countQuestions( @Args() arg: ArgTopicId ): Promise<number> {
        try {
            return await this.question_service.countQuestions(arg.id);
        } catch ( error ) {
            throw error;
        }
    }

    @Query( returns => Question )
    async loadQuestion( @Args() arg: ArgQuestionId ): Promise<Question> {
        try {
            return await this.question_service.loadOne(arg.id);
        } catch ( error ) {
            throw error;
        }
    }

    @Mutation( returns => Question )
    async createQuestion( @Args() args: ArgCreateQuestion ): Promise<Question> {
        try {
            return await this.question_service.create(args);
        } catch ( error ) {
            throw error;
        }
    }

    @ResolveProperty()
    async answers( @Parent() question: Question ): Promise<Answer[]> {
        try {
            return await this.answer_service.findByQuestion(question.id);
        } catch ( error ) {
            throw error;
        }
    }
}