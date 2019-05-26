import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { Topic, ArgTopicId, Topics, ArgCreateTopic } from './topic.dto';
import { TopicService } from './topic.service';
import { ArgsPageInfo } from '../common/page.info';

@Resolver( of => Topic )
export class TopicResolver {
    constructor(
        private readonly topic_service: TopicService,
    ){}
    @Query( returns => Topic )
    async item( @Args() arg: ArgTopicId ): Promise<Topic> {
        try {
            return await this.topic_service.findByOne(arg.id);
        } catch ( error ) {
            throw error;
        }
    }
    @Query( returns => Topics )
    async items( @Args() meta_page: ArgsPageInfo ): Promise<Topics> {
        try {
            return await this.topic_service.findByMany(meta_page);
        } catch ( error ) {
            throw error;
        }
    }

    @Mutation( returns => Topic )
    async createItem( @Args() args: ArgCreateTopic ) {
        try {
            return await this.topic_service.create(args.name);
        } catch ( error ) {
            throw error;
        }
    }
}