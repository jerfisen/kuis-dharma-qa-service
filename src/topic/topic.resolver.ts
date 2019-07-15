import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { Topic, ArgTopicId, Topics, ArgCreateTopic, ArgTopicSearch } from './topic.entity';
import { TopicService } from './topic.service';
import { ArgsPageInfo } from '../common/page.info.dto';
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from '../auth/auth.user.data';

@Resolver( of => Topic )
@UseGuards( AuthGuard )
export class TopicResolver {
    constructor(
        private readonly topic_service: TopicService,
    ){}

    @Query( returns => Topic )
    async topic( @Args() arg: ArgTopicId ): Promise<Topic> {
        try {
            return await this.topic_service.loadOne(arg.id);
        } catch ( error ) {
            throw error;
        }
    }

    @Query( returns => Topics )
    async topics( @Args() meta_page: ArgsPageInfo ): Promise<Topics> {
        try {
            return await this.topic_service.loadMany(meta_page);
        } catch ( error ) {
            throw error;
        }
    }

    @Query( returns => Topics )
    async searchTopic( @Args() arg_phrase: ArgTopicSearch, meta_page: ArgsPageInfo ): Promise<Topics> {
        try {
            return await this.topic_service.search( arg_phrase.phrase,  meta_page );
        } catch ( error ) {
            throw error;
        }
    }

    @Mutation( returns => Topic )
    async createTopic( @Args() args: ArgCreateTopic ) {
        try {
            return await this.topic_service.create(args.name);
        } catch ( error ) {
            throw error;
        }
    }
}