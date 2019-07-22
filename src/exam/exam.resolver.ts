import { UseGuards } from "@nestjs/common";
import { Resolver, Args, Mutation, Query } from "@nestjs/graphql";
import { AuthUser, AuthData, AuthGuard } from '../auth/auth.user.data';
import { Exam, Exams, ArgExam } from "./exam.entity";
import { ExamService } from './exam.service';
import { ArgsPageInfo } from "../common/page.info.dto";

@Resolver( of => Exam )
export class ExamResolver {
    constructor(
        private readonly service: ExamService,
    ){}

	@UseGuards( AuthGuard )
    @Mutation( returns => Exam )
	async saveExam( @AuthUser() auth: AuthData, @Args() arg: ArgExam ): Promise<Exam> {
		try {
			return await this.service.saveExam(auth, arg);
		} catch ( error ) {
			throw error;
		}
	}

	@UseGuards( AuthGuard )
	@Query( returns => Exams )
	async loadExams( @AuthUser() auth: AuthData, @Args() arg_page_info: ArgsPageInfo ): Promise<Exams> {
		try {
			return await this.service.loadMany(auth, arg_page_info);
		} catch ( error ) {
			throw error;
		}
	}

	@Query( returns => Exams )
	async loadExamsAllUsers( @Args() arg_page_info: ArgsPageInfo ): Promise<Exams> {
		try {
			return await this.service.loadManyAllUser(arg_page_info);
		} catch ( error ) {
			throw error;
		}
	}
}