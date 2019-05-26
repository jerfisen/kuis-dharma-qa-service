import { ObjectType, Field } from 'type-graphql';
import { Topic } from '../topic/topic.dto';

@ObjectType()
export class Question {
    id: string;

    text_content: string;

    media_content: string[];

    @Field( type => [Topic] )
    topic: Topic[];
}