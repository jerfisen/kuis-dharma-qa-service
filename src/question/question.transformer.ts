import { Injectable } from "@nestjs/common";
import { Answer, Question } from './question.dto';
import { AnswerEntity, QuestionEntity } from 'kuis-dharma-database';
import { plainToClass } from 'class-transformer';

@Injectable()
export class QuestionTransformer {

    toQuestion( entity: QuestionEntity ): Question {
        return plainToClass( Question, {
            id: entity.id,
            text_content: entity.text_content,
            media_content: entity.media_content,
        } as Question );
    }

    toAnswer( entity: AnswerEntity ): Answer {
        return plainToClass( Answer, {
            id: entity.id,
            text_content: entity.text_content,
            media_content: entity.media_content,
        } as Answer );
    }
}