import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Node } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';
import {
  Column,
  CreateDateColumn,
  DeepPartial,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType('HistoryEntity', {
  implements: [Node],
})
@Entity({
  name: 'histories',
})
export class HistoryEntity implements Node {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Field(() => ID)
  @Column('bigint')
  userId: string;

  @Field(() => String)
  @Column({
    name: 'container_image',
    nullable: false,
    default: 'images/glass-of-water.png',
  })
  containerImage: string;

  @Field(() => Number)
  @Column({ name: 'container_volume', nullable: false, default: 300 })
  containerVolume: number;

  @Field(() => Number)
  @Column({ name: 'goal', nullable: false, default: 2000 })
  goal: number;

  @Field(() => Number)
  @Column({ name: 'progress', nullable: false, default: 0 })
  progress: number;

  @Field(() => Number)
  @Column({ name: 'drink_at_a_time', nullable: false, default: 300 })
  drinkAtATime: number;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: DeepPartial<HistoryEntity>) {
    Object.assign(this, { id: snowflake.nextId().toString(), ...partial });
  }
}
