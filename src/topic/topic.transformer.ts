import { Injectable } from "@nestjs/common";
import { plainToClass } from 'class-transformer';
import { TopicEntity } from "kuis-dharma-database";
import { PageInfo, ArgsPageInfo } from '../common/page.info.dto';
import { Topic, Topics } from './topic.dto';

@Injectable()
export class TopicTransformer {
    toTopic( entity: TopicEntity ): Topic {
        return plainToClass( Topic, {
            id: entity.id.toString(),
            name: entity.name,
        } as Topic );
    }

    toTopics( entities: TopicEntity[], count: number, page_info: ArgsPageInfo ): Topics {
        return plainToClass( Topics, {
            list: entities.map( ( entity ) => this.toTopic( entity ) ),
            page_info: plainToClass( PageInfo, {
                per_page: +page_info.per_page,
                page: +page_info.page,
                total_pages: +page_info.per_page > count ? 1 : Math.ceil( count / +page_info.per_page ),
                total_result: count,
            } as PageInfo ),
        } as Topics );
}
}