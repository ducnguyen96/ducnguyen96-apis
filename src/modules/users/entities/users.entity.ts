import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { GENDER } from 'src/graphql/enums/common';
import { Node } from 'src/graphql/types/common.interface.entity';
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
  name: 'users',
})
export class UserEntity implements Node {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Field(() => String, { nullable: false })
  @Column({ length: 50, name: 'username', nullable: false })
  username: string;

  @Field(() => String, { nullable: false })
  @Column({
    name: 'avatar',
    nullable: false,
    default: 'https://robohash.org/honey?set=set1',
  })
  avatar: string;

  @HideField()
  @Column({ nullable: true, name: 'password' })
  password: string;

  @HideField()
  @Column({ nullable: true, name: 'password_salt' })
  passwordSalt: string;

  @Field(() => Boolean)
  @Column({ name: 'remind_me', nullable: false, default: true })
  remindMe: boolean;

  @Field(() => Date)
  @CreateDateColumn({ name: 'wake_up_time', nullable: false })
  wakeUpTime: Date;

  @Field(() => Date)
  @CreateDateColumn({ name: 'sleep_time', nullable: false })
  sleepTime: Date;

  @Field(() => GENDER)
  @Column({
    name: 'gender',
    nullable: false,
    enum: GENDER,
    default: GENDER.MALE,
  })
  gender: GENDER;

  @Field(() => Number)
  @Column({ name: 'weight', nullable: false, default: 50 })
  weight: number;

  @Field(() => Number)
  @Column({ name: 'daily_intake', nullable: false, default: 2000 })
  dailyIntake: number;

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

  @Field(() => String, { nullable: true })
  @Column({ name: 'vapid_key', nullable: true })
  vapidKey?: string;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: DeepPartial<UserEntity>) {
    Object.assign(this, { id: snowflake.nextId().toString(), ...partial });
  }
}
