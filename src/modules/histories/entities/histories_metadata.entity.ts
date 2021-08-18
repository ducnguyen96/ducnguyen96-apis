import { ObjectType, Field, ID } from '@nestjs/graphql';
import { snowflake } from 'src/helpers/common';
import {
  Entity,
  Column,
  CreateDateColumn,
  DeepPartial,
  UpdateDateColumn,
} from 'typeorm';
import { Node } from 'src/graphql/types/common.interface.entity';

@ObjectType({
  implements: [Node],
})
@Entity({
  name: 'histories_metadata',
})
export class HistoryMetadataEntity implements Node {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Field(() => ID)
  @Column('bigint')
  historyId: string;

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
  @Column({ name: 'drink_at_a_time', nullable: false, default: 300 })
  drinkAtATime: number;

  @Field(() => Date)
  @Column({ name: 'drink_at', nullable: false })
  drinkAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ name: 'drank_at', nullable: true })
  drankAt: Date;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: DeepPartial<HistoryMetadataEntity>) {
    Object.assign(this, { id: snowflake.nextId().toString(), ...partial });
  }
}
