import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import DatabaseModule from './common/database.module';
import { TopicModule } from './topic/topic.module';
import { QuestionModule } from './question/question.module';

@Module({
	imports: [
		DatabaseModule,
		TopicModule,
		QuestionModule,
		GraphQLModule.forRoot({
			installSubscriptionHandlers: true,
			autoSchemaFile: 'schema.gql',
			debug: true,
			introspection: true,
			playground: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
