import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class QueryUsersInput {
  @Field()
  id: string;
}
