import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Question } from '../question/question.entity';
import { ObjectType, Field, ID, ArgsType } from 'type-graphql';
import { PageInfo } from '../common/page.info.dto';

@ObjectType()
@Entity( { name: 'topic' } )
export class Topic {
    @PrimaryGeneratedColumn('increment', { type: 'int' })
    @Field( type => ID )
    id: number;

    @Column({
        type: 'varchar',
        length: 20,
        nullable: false,
    })
    @Field()
    name: string;

    @ManyToMany( type => Question, question => question.topics, { lazy: false } )
    questions: Promise<Question[]>;
}

@ObjectType()
export class Topics {
    @Field( type => [Topic] )
    list: Topic[];

    @Field( type => PageInfo )
    page_info: PageInfo;
}

@ArgsType()
export class ArgTopicId {

    @Field( type => ID )
    id: string;

}

@ArgsType()
export class ArgTopicSearch {

    @Field()
    phrase: string;

}

@ArgsType()
export class ArgCreateTopic {

    @Field()
    name: string;

}