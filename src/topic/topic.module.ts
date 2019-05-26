import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicEntity } from 'kuis-dharma-database';
import { TopicService } from './topic.service';
import { TopicTransformer } from './topic.transformer';
import { TopicResolver } from './topic.resolver';
@Module({
    imports: [ 
        TypeOrmModule.forFeature([TopicEntity]),
    ],
    exports: [
        TopicService,
    ],
    providers: [
        TopicService,
        TopicTransformer,
        TopicResolver,
    ],
    controllers: [],
})
export class TopicModule {}