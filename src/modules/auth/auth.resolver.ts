import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users/services/users.service';
import { AuthService } from './auth.service';
import { RegisterPayload } from './dto/RegisterPayload';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { UserLoginInput } from './dto/UserLogin.input';
import { UserRegisterInput } from './dto/UserRegister.input';

@Resolver()
export class AuthResolver {
  constructor(
    public readonly userService: UsersService,
    public readonly authService: AuthService,
  ) {}

  @Mutation(() => RegisterPayload)
  async userRegister(
    @Args('input') input: UserRegisterInput,
  ): Promise<RegisterPayload> {
    const createdUser = await this.userService.createUser(input);
    const token = await this.authService.createToken(createdUser);
    return {
      token,
      user: createdUser,
    };
  }

  @Mutation(() => TokenPayloadDto)
  async login(@Args('input') input: UserLoginInput): Promise<TokenPayloadDto> {
    const user = await this.authService.validateUser(input);
    const token = await this.authService.createToken(user);
    return {
      ...token,
    };
  }
}
