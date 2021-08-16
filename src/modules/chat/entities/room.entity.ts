import { Field, ID, ObjectType } from '@nestjs/graphql';
import { NAMESPACE } from 'src/graphql/enums/common';
import {
  Node,
  PaginationBase,
} from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';
import {
  Column,
  CreateDateColumn,
  DeepPartial,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType({
  implements: [Node],
})
@Entity({
  name: 'rooms',
})
export class RoomEntity implements Node {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Field(() => String, { nullable: false })
  @Column({ name: 'name', nullable: false })
  name: string;

  @Field(() => NAMESPACE, { nullable: false })
  @Column({ name: 'namespace', nullable: false, enum: NAMESPACE })
  namespace: NAMESPACE;

  @Field(() => String, { nullable: false })
  @Column({
    name: 'image',
    nullable: false,
    default: 'https://robohash.org/honey?set=set1',
  })
  image: string;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: DeepPartial<RoomEntity>) {
    Object.assign(this, { id: snowflake.nextId().toString(), ...partial });
  }
}

@ObjectType()
export class RoomConnection extends PaginationBase(RoomEntity) {}
