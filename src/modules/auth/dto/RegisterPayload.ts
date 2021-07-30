import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'src/modules/users/entities/users.entity';

import { TokenPayloadDto } from './TokenPayloadDto';

@ObjectType()
export class RegisterPayload {
  @Field()
  user: UserEntity;

  @Field()
  token: TokenPayloadDto;
}
