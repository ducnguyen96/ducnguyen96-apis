import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryUsersInput } from '../dtos/users.input';

@Resolver(() => String)
export class UsersQueriesResolver {
  @Query(() => String)
  getHello(@Args('input') input: QueryUsersInput) {
    return input.id;
  }
}
