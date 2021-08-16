import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthGuardRequired } from 'src/guards/auth.guard';
import { QueryUsersInput } from '../dtos/users.input';
import { UserEntity } from '../entities/users.entity';

@Resolver(() => String)
export class UsersQueriesResolver {
  @Query(() => String)
  getHello(@Args('input') input: QueryUsersInput) {
    return input.id;
  }

  @UseGuards(AuthGuardRequired)
  @Query(() => UserEntity)
  me(@AuthUser() user: UserEntity): UserEntity {
    return user;
  }
}
