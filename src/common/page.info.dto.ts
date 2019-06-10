import { ObjectType, Field, Int, ArgsType } from 'type-graphql';
import { Min, Max } from 'class-validator';
@ObjectType()
export class PageInfo {
    @Field( type => Int )
    total_pages: number;

    @Field( type => Int )
    total_result: number;

    @Field( type => Int )
    current_page: number;

    @Field( type => Int )
    per_page: number;
}

@ArgsType()
export class ArgsPageInfo {
    @Field( type => Int )
    @Min(1)
    @Max(100)
    per_page: number = 25;

    @Field( type => Int )
    @Min(1)
    current_page: number = 1;
}