import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { TopicEntity } from 'kuis-dharma-database';
import { TopicTransformer } from './topic.transformer';
import { Topic, Topics } from './topic.dto';
import { ArgsPageInfo } from '../common/page.info';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(TopicEntity)
        private readonly topic_repository: Repository<TopicEntity>,
        private readonly transformer: TopicTransformer,
    ) {}

    public async findByOne( id: string ): Promise<Topic> {
        try {
            const topic = await this.topic_repository.findOne(id);
            if ( !topic ) throw new NotFoundException(id);
            return this.transformer.toTopic(topic);
        } catch ( error ) {
            throw error;
        }
    }

    public async findByMany( meta_page: ArgsPageInfo ): Promise<Topics> {
        try {
            const [topics, count] = await this.topic_repository.findAndCount({
                take: meta_page.per_page,
                skip: ( ( meta_page.current_page - 1 ) * meta_page.per_page ),
            });
            return this.transformer.toTopics( topics, count, meta_page );
        } catch ( error ) {
            throw error;
        }
    }

    public async findEntityInId( topic_ids: number[] ): Promise<TopicEntity[]> {
        try {
            return await this.topic_repository.find({
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
            const [ topics, count ] = await this.topic_repository.findAndCount({
                where: {
                    name: Like(`%${phrase}%`),
                },
                take: meta_page.per_page,
                skip: ( ( meta_page.current_page - 1 ) * meta_page.per_page ),
            });
            return this.transformer.toTopics( topics, count, meta_page );
        } catch ( error ) {
            throw error;
        }
    }

    public async create( name: string ): Promise<Topic> {
        try {
            const topic = new TopicEntity();
            topic.name = name;
            return this.transformer.toTopic( await this.topic_repository.save(topic) );
        } catch ( error ) {
            throw error;
        }
    }
}