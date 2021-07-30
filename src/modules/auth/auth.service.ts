import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UtilsProvider } from 'src/providers/utils.provider';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { UserEntity } from '../users/entities/users.entity';
import { UsersService } from '../users/services/users.service';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { UserLoginInput } from './dto/UserLogin.input';

@Injectable()
export class AuthService {
  constructor(
    public readonly jwtService: JwtService,
    public readonly configService: ApiConfigService,
    public readonly userService: UsersService,
  ) {}

  async createToken(user: UserEntity): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({ id: user.id }),
    });
  }

  async validateUser(userLoginInput: UserLoginInput): Promise<UserEntity> {
    const user = await this.userService.findOne({
      username: userLoginInput.username,
    });

    if (!user) {
      throw new NotFoundException('username or password is not correct !');
    }

    const isPasswordValid = await UtilsProvider.validateHash(
      userLoginInput.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new NotFoundException('username or password is not correct !');
    }
    return user;
  }
}
