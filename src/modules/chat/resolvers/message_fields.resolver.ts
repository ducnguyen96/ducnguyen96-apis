import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserEntity } from 'src/modules/users/entities/users.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { MessageEntity } from '../entities/message.entity';

@Resolver(() => MessageEntity)
export class MessageFieldResolver {
  constructor(private readonly usersService: UsersService) {}

  @ResolveField(() => UserEntity, {
    nullable: false,
    defaultValue: {},
  })
  async user(@Parent() message: MessageEntity) {
    return this.usersService.findOne({ id: message.userId });
  }
}
