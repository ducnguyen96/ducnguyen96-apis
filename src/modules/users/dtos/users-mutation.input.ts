import { Field, InputType } from '@nestjs/graphql';
import { GENDER } from 'src/graphql/enums/common';

@InputType()
export class UpdateUserSettingInput {
  @Field(() => Boolean)
  remindMe: boolean;

  @Field(() => Date)
  wakeUpTime: Date;

  @Field(() => Date)
  sleepTime: Date;

  @Field(() => GENDER)
  gender: GENDER;

  @Field(() => Number)
  weight: number;

  @Field(() => Number)
  dailyIntake: number;

  @Field(() => Number, { defaultValue: 300 })
  drinkAtATime: number;

  @Field(() => Number, { defaultValue: 300 })
  containerVolume: number;
}
