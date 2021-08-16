import { Field, ID, ObjectType } from '@nestjs/graphql';
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
  name: 'messages',
})
export class MessageEntity implements Node {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Field(() => ID, { nullable: false })
  @Column('bigint', { name: 'user_id', nullable: false })
  userId: string;

  @Field(() => ID, { nullable: false })
  @Column('bigint', { name: 'room_id', nullable: false })
  roomId: string;

  @Field(() => String, { nullable: false })
  @Column({ name: 'content', nullable: false })
  content: string;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: DeepPartial<MessageEntity>) {
    Object.assign(this, { id: snowflake.nextId().toString(), ...partial });
  }
}

@ObjectType()
export class MessageConnection extends PaginationBase(MessageEntity) {}
