import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicService } from './topic.service';
import { TopicResolver } from './topic.resolver';
import { AuthModule } from '../auth/auth.module';
import { Topic } from './topic.entity';
@Module({
    imports: [ 
        TypeOrmModule.forFeature([Topic]),
        AuthModule,
    ],
    exports: [
        TopicService,
    ],
    providers: [
        TopicService,
        TopicResolver,
    ],
    controllers: [],
})
export class TopicModule {}