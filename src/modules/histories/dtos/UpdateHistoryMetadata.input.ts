import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateHistoryMetadataInput {
  @Field()
  id: string;

  @Field()
  containerImage: string;

  @Field()
  containerVolume: number;

  @Field()
  drinkAtATime: number;

  @Field()
  drinkAt: Date;

  @Field({ nullable: true })
  drankAt?: Date;
}
