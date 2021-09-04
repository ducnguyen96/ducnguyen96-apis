import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthGuardRequired } from 'src/guards/auth.guard';
import { OptAuthGuard } from 'src/guards/opt-auth.guard';
import { UpdateUserSettingInput } from '../dtos/users-mutation.input';
import { UserEntity } from '../entities/users.entity';
import { UsersService } from '../services/users.service';

@Resolver(() => UserEntity)
export class UsersMutationsResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(OptAuthGuard)
  @Mutation(() => String)
  updateUserVapidKey(
    @AuthUser() user: UserEntity,
    @Args('vapidKey') vapidKey: string,
  ): Promise<string> {
    return this.usersService.updateUserVapidKey(user, vapidKey);
  }

  @UseGuards(AuthGuardRequired)
  @Mutation(() => UserEntity)
  updateUserSetting(
    @Args('input') input: UpdateUserSettingInput,
    @AuthUser() user: UserEntity,
  ) {
    return this.usersService.updateUserSetting(input, user);
  }
}
