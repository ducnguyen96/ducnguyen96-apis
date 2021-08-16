import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/modules/users/entities/users.entity';
import { FindConditions } from 'typeorm';
import { QueryMessagesInput } from '../dto/messages.input';
import { MessageConnection, MessageEntity } from '../entities/message.entity';
import { MessageRepository } from '../repositories/chat.repositories';

@Injectable()
export class MessageService {
  constructor(public readonly messageRepository: MessageRepository) {}
  findOne(
    findData: FindConditions<MessageEntity>,
  ): Promise<MessageEntity | undefined> {
    return this.messageRepository.findOne(findData);
  }

  async createMessage(
    user: UserEntity,
    roomId: string,
    content: string,
  ): Promise<MessageEntity> {
    const creMessage = this.messageRepository.create({
      userId: user.id,
      content,
      roomId,
    });
    return this.messageRepository.save(creMessage);
  }

  async messages(input: QueryMessagesInput): Promise<MessageConnection> {
    const { limit = 10, page = 1 } = input;
    const qb = this.messageRepository.createQueryBuilder('m');
    qb.where(`m.room_id = ${input.roomId}`);
    qb.orderBy(`m.updated_at`, 'DESC');
    return this.messageRepository.parsePaginate(qb, { limit, page });
  }
}
