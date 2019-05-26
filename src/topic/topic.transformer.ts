import { Injectable } from "@nestjs/common";
import { plainToClass } from 'class-transformer';
import { TopicEntity } from "kuis-dharma-database";
import { PageInfo, ArgsPageInfo } from '../common/page.info';
import { Topic, Topics } from './topic.dto';

@Injectable()
export class TopicTransformer {
    toTopic( entity: TopicEntity ): Topic {
        return plainToClass( Topic, {
            id: entity.id.toString(),
            name: entity.name,
        } as Topic );
    }

    toTopics( entities: TopicEntity[], count: number, meta_page: ArgsPageInfo ): Topics {
        return plainToClass( Topics, {
            list: entities.map( ( entity ) => this.toTopic( entity ) ),
            page_info: plainToClass( PageInfo, {
                per_page: meta_page.per_page,
                current_page: meta_page.current_page,
                total_pages: meta_page.per_page > count ? 1 : Math.ceil( count / meta_page.per_page ),
                total_result: count,
            } as PageInfo ),
        } as Topics );
}
}