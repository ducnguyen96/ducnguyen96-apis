import { registerEnumType } from '@nestjs/graphql';

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
registerEnumType(GENDER, {
  name: 'GENDER',
});
