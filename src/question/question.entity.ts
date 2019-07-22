import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { Topic } from '../topic/topic.entity';
import { ObjectType, ArgsType, InputType, Field, ID, Int } from 'type-graphql';
import { PageInfo } from '../common/page.info.dto';

@ObjectType()
@Entity( { name: 'question' } )
export class Question {
    @Field( type => ID )
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: string;

    @Field()
    @Column({
        type: 'text',
        nullable: false,
    })
    text_content: string;

    @Field( type => [String] )
    @Column({
        type: 'simple-array',
        nullable: true,
        default: [],
    })
    media_content: string[];

    @Field( type => [Answer] )
    answers: Answer[];

    @Field( type => [Topic] )
    @ManyToMany( type => Topic, topic => topic.questions, { lazy: true } )
    @JoinTable()
    topics: Promise<Topic[]>;
}

@ObjectType()
@Entity( { name: 'answer' } )
export class Answer {
    @Field( type => ID )
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: string;

    @Field()
    @Column({
        type: 'text',
        nullable: false,
    })
    text_content: string;

    @Field( type => [String] )
    @Column({
        type: 'simple-array',
        nullable: true,
        default: [],
    })
    media_content: string[];
}

@Entity( { name: 'question_answer' } )
export class QuestionAnswer {
    @ManyToOne( type => Question, question => question.id, { primary: true, nullable: false, onDelete: 'CASCADE', eager: true } )
    @JoinColumn({ name: 'question', referencedColumnName:'id' })
    question: Question;

    @ManyToOne( type => Answer, answer => answer.id, { primary: true, nullable: false, onDelete:'CASCADE', eager: true } )
    @JoinColumn( { name: 'answer', referencedColumnName: 'id' } )
    answer: Answer;

    @Column({
        type: 'boolean',
        nullable: false,
    })
    correct_answer: boolean;
}

export class Questions {
    @Field( type => [Question] )
    list: Question[];

    @Field( type => PageInfo )
    page_info: PageInfo;
}

@ArgsType()
export class ArgCreateQuestion {

    @Field()
    text_content: string;

    @Field( type => [String], { nullable: true } )
    media_content: string[];

    @Field( type => [ID] )
    topics: string[];

    @Field( type => [ArgCreateAnswer] )
    answers: ArgCreateAnswer[];

    @Field( type => ID )
    correct_answer: string;
}

@InputType()
export class ArgCreateAnswer {

    @Field( type => ID )
    id: string;

    @Field()
    text_content: string;

    @Field( type => [String], { nullable: true } )
    media_content: string[];
}

@ArgsType()
export class ArgQuestionId {

    @Field( type => ID )
    id: string;
}

@ArgsType()
export class ArgsDoExam {
    @Field( type => Int )
    length: number;

    @Field( type => ID )
    topic: string;

    @Field( type => Int )
    seed = -1;
}