import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenPayloadDto {
  @Field()
  expiresIn: number;

  @Field()
  accessToken: string;

  constructor(data: { expiresIn: number; accessToken: string }) {
    this.expiresIn = data.expiresIn;
    this.accessToken = data.accessToken;
  }
}
