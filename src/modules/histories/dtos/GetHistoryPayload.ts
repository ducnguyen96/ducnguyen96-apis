import { Field, ObjectType } from '@nestjs/graphql';
import { TokenPayloadDto } from 'src/modules/auth/dto/TokenPayloadDto';
import { UserEntity } from 'src/modules/users/entities/users.entity';
import { HistoryEntity } from '../entities/histories.entity';

@ObjectType()
export class GetHistoryPayload {
  @Field({ nullable: true })
  accessToken?: TokenPayloadDto;

  @Field((type) => [HistoryEntity], { nullable: false })
  histories: HistoryEntity[];

  @Field({ nullable: true })
  user?: UserEntity;
}
