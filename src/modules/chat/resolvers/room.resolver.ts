import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NAMESPACE } from 'src/graphql/enums/common';
import { RoomEntity } from '../entities/room.entity';
import { RoomService } from '../services/room.service';

@Resolver()
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}
  @Query(() => [RoomEntity])
  rooms(@Args('namespace') namespace: NAMESPACE) {
    return this.roomService.rooms(namespace);
  }

  @Mutation(() => RoomEntity)
  createRoom(
    @Args('namespace') namespace: NAMESPACE,
    @Args('name') name: string,
  ) {
    return this.roomService.createRoom(namespace, name);
  }
}
