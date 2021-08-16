import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class QueryMessagesInput {
  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: true })
  limit?: number;

  @Field()
  roomId: string;
}

@InputType()
export class CreateMessageInput {
  @Field({ nullable: false })
  roomId: string;

  @Field({ nullable: false })
  content: string;
}
