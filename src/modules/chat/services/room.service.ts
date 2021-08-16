import { Injectable } from '@nestjs/common';
import { NAMESPACE } from 'src/graphql/enums/common';
import { FindConditions } from 'typeorm';
import { RoomConnection, RoomEntity } from '../entities/room.entity';
import { RoomRepository } from '../repositories/chat.repositories';

@Injectable()
export class RoomService {
  constructor(public readonly roomRepository: RoomRepository) {}
  findOne(
    findData: FindConditions<RoomEntity>,
  ): Promise<RoomEntity | undefined> {
    return this.roomRepository.findOne(findData);
  }

  async createRoom(namespace: NAMESPACE, name: string): Promise<RoomEntity> {
    const user = this.roomRepository.create({
      name,
      namespace,
      image: 'https://i.pravatar.cc/300',
    });
    return this.roomRepository.save(user);
  }

  async rooms(namespace: NAMESPACE): Promise<RoomConnection> {
    return this.roomRepository.find({
      where: { namespace },
      order: { updatedAt: 'DESC' },
    });
  }
}
