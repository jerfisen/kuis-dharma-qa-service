import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Topic, Topics } from './topic.entity';
import { ArgsPageInfo, PageInfo } from '../common/page.info.dto';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(Topic)
        private readonly repository: Repository<Topic>,
    ) {}

    public async loadOne( id: string ): Promise<Topic> {
        try {
            const topic = await this.repository.findOne(id);
            if ( !topic ) throw new NotFoundException(id);
            return topic;
        } catch ( error ) {
            throw error;
        }
    }

    public async loadMany( meta_page: ArgsPageInfo ): Promise<Topics> {
        try {
            const [topics, count] = await this.repository.findAndCount({
                take: meta_page.per_page,
                skip: ( ( meta_page.page - 1 ) * meta_page.per_page ),
            });
            return this.toTopics( topics, count, meta_page );
        } catch ( error ) {
            throw error;
        }
    }

    public async loadEntityInId( topic_ids: number[] ): Promise<Topic[]> {
        try {
            return await this.repository.find({
                where: { 
                    id: In(topic_ids),
                },
            });
        } catch ( error ) {
            throw error;
        }
    }

    public async search( phrase: string, meta_page: ArgsPageInfo ): Promise<Topics> {
        try {
            const [ topics, count ] = await this.repository.findAndCount({
                where: {
                    name: Like(`%${phrase}%`),
                },
                take: meta_page.per_page,
                skip: ( ( meta_page.page - 1 ) * meta_page.per_page ),
            });
            return this.toTopics( topics, count, meta_page );
        } catch ( error ) {
            throw error;
        }
    }

    public async create( name: string ): Promise<Topic> {
        try {
            const topic = new Topic();
            topic.name = name;
            return topic;
        } catch ( error ) {
            throw error;
        }
    }

    toTopics( entities: Topic[], count: number, page_info: ArgsPageInfo ): Topics {
        const topics = new Topics();
        topics.list = entities;
        topics.page_info = new PageInfo();
        topics.page_info.page = +page_info.page;
        topics.page_info.per_page = +page_info.per_page;
        topics.page_info.total_pages = +page_info.per_page > count ? 1 : Math.ceil( count / +page_info.per_page );
        topics.page_info.total_result = count;
        return topics;
    }

}