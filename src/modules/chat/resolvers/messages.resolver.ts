import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthGuardRequired } from 'src/guards/auth.guard';
import { UserEntity } from 'src/modules/users/entities/users.entity';
import { CreateMessageInput, QueryMessagesInput } from '../dto/messages.input';
import { MessageConnection, MessageEntity } from '../entities/message.entity';
import { MessageService } from '../services/message.service';

@Resolver()
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}
  @Query(() => MessageConnection)
  messages(@Args('input') input: QueryMessagesInput) {
    return this.messageService.messages(input);
  }

  @UseGuards(AuthGuardRequired)
  @Mutation(() => MessageEntity)
  createMessage(
    @AuthUser() user: UserEntity,
    @Args('input') input: CreateMessageInput,
  ) {
    return this.messageService.createMessage(user, input.roomId, input.content);
  }
}
