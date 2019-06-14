import { ObjectType, Field, ArgsType, ID, Int, InputType } from 'type-graphql';
import { Topic } from '../topic/topic.dto';
import { PageInfo } from '../common/page.info.dto';

@ObjectType()
export class Answer {
    @Field( type => ID )
    id: number;

    @Field()
    text_content: string;

    @Field( type => [String] )
    media_content: string[];
}

@ObjectType()
export class Question {
    @Field( type => ID )
    id: string;

    @Field()
    text_content: string;

    @Field( type => [String] )
    media_content: string[];

    @Field( type => [Answer] )
    answers: Answer[];

    @Field( type => [Topic] )
    topics: Topic[];
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
}