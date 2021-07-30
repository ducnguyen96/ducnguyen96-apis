import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class UserRegisterInput {
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

  @Field()
  @MinLength(6, {
    message: 'password must be longer than 6',
  })
  @IsString()
  readonly repeatPassword: string;
}
