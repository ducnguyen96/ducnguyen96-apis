import { Field, InputType } from '@nestjs/graphql';
import { MinLength, IsString } from 'class-validator';

@InputType()
export class UserLoginInput {
  @Field()
  @MinLength(6, {
    message: 'username must be longer than 6',
  })
  readonly username: string;

  @Field()
  @MinLength(6, {
    message: 'password must be longer than 6',
  })
  @IsString()
  readonly password: string;
}
