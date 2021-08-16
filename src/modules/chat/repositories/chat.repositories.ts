import { CommonRepository } from 'src/modules/common/common.repository';
import { EntityRepository } from 'typeorm';
import { MessageEntity } from '../entities/message.entity';
import { RoomEntity } from '../entities/room.entity';

@EntityRepository(RoomEntity)
export class RoomRepository extends CommonRepository<RoomEntity> {}

@EntityRepository(MessageEntity)
export class MessageRepository extends CommonRepository<MessageEntity> {}
