import { ObjectType, Field, ID, ArgsType } from 'type-graphql';
import { PageInfo } from '../common/page.info';

@ObjectType()
export class Topic {
    @Field( type => ID )
    id: string;

    @Field()
    name: string;
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
export class ArgCreateTopic {

    @Field()
    name: string;

}
