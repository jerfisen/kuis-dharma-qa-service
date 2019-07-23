import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Column } from 'typeorm';
import { User } from '../user/user.entity';
import { ObjectType, ArgsType, InputType, Field, ID, Float } from 'type-graphql';
import { Question, Answer } from '../question/question.entity';
import { PageInfo } from '../common/page.info.dto';

@ObjectType()
@Entity( { name: 'exam' } )
export class Exam {
    @Field( type => ID )
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: string;

    @Field()
    @CreateDateColumn({ type: 'timestamptz', nullable: false })
    date: Date;
    
    @Field( type => User )
    @ManyToOne( type => User, user => user.id, { nullable: false, onDelete: 'CASCADE', lazy: true } )
    @JoinColumn({ name: 'user_entity', referencedColumnName: 'id' })
    user:  Promise<User>;

    @Field( type => Float )
    skor: number;

    @Field( type => [Work] )
    works: Work[];

    @Column({
        type: 'timestamptz',
        nullable: true,
    })
    quiz: Date;
}

@ObjectType()
@Entity( { name: 'exam_work' } )
export class Work {
    @ManyToOne( type => Exam, exam => exam.id, { nullable: false, onDelete: 'CASCADE', primary : true, eager: true } )
    @JoinColumn({ name: 'exam', referencedColumnName: 'id' })
    exam:  Exam;

    @Field( type => Question )
    @ManyToOne( type => Question, question => question.id, { nullable: false, onDelete: 'CASCADE', primary : true, eager: true } )
    @JoinColumn({ name: 'question', referencedColumnName: 'id' })
    question:  Question;
    
    @ManyToOne( type => Answer, answer => answer.id, { nullable: true, onDelete: 'CASCADE', primary : false, eager: true } )
    @JoinColumn({ name: 'answer', referencedColumnName: 'id' })
    answer:  Answer;

    @Field( type => Answer )
    correct_answer: Answer;
    
    @Field( type => Answer, { nullable: true } )
    selected_answer: Answer;

    @Field( type => Boolean )
    is_correct: boolean;
}

@ObjectType()
export class Exams {

    @Field( type => PageInfo )
    meta: PageInfo;

    @Field( type => [Exam] )
    list: Exam[];
}

@InputType()
export class ArgsWork {
    @Field( type => ID )
    question_id: string;

    @Field( type => ID )
    answer_id: string;
}

@ArgsType()
export class ArgExam {
    @Field( type => [ArgsWork] )
    works: ArgsWork[];

    @Field( { nullable: true } )
    quiz: Date;
}

@ArgsType()
export class ArgQuiz {
    @Field( { nullable: true } )
    quiz: Date;
}