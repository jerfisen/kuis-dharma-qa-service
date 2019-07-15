import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import DatabaseModule from './common/database.module';
import { TopicModule } from './topic/topic.module';
import { QuestionModule } from './question/question.module';
import { ExamModule } from './exam/exam.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		DatabaseModule,
		AuthModule,
		TopicModule,
		QuestionModule,
		ExamModule,
		GraphQLModule.forRoot({
			installSubscriptionHandlers: true,
			autoSchemaFile: 'schema.gql',
			debug: true,
			introspection: true,
			playground: true,
			context: ( { req } ) => ({ req }),
		}),
	],
})
export class AppModule {}
