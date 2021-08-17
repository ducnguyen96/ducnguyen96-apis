import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRegisterInput } from 'src/modules/auth/dto/UserRegister.input';
import { FindConditions } from 'typeorm';
import { UserEntity } from '../entities/users.entity';
import { UserRepository } from '../repositories/users.repository';
import bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(public readonly userRepository: UserRepository) {}
  findOne(
    findData: FindConditions<UserEntity>,
  ): Promise<UserEntity | undefined> {
    return this.userRepository.findOne(findData);
  }

  async createUser(userRegisterInput: UserRegisterInput): Promise<UserEntity> {
    const { username, password, repeatPassword } = userRegisterInput;
    console.log(userRegisterInput);
    if (password !== repeatPassword) {
      throw new ForbiddenException(
        'Password and repeat password are differnet !',
      );
    }

    // check email existed
    const userWithUsername = await this.userRepository.findOne({ username });

    if (userWithUsername !== undefined) {
      throw new ForbiddenException('Username has been used !');
    }

    const user = this.userRepository.create({ ...userRegisterInput });
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(userRegisterInput.password, salt);
    user.passwordSalt = salt;
    return this.userRepository.save(user);
  }
}
