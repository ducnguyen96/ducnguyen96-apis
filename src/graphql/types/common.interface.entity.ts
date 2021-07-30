import { Field, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType({
  description: 'Node',
})
export abstract class Node {
  @Field(() => ID)
  id: string;
}
