import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRegisterInput } from 'src/modules/auth/dto/UserRegister.input';
import { FindConditions, getConnection } from 'typeorm';
import { UserEntity } from '../entities/users.entity';
import { UserRepository } from '../repositories/users.repository';
import bcrypt from 'bcryptjs';
import { UpdateUserSettingInput } from '../dtos/users-mutation.input';
import { HistoryService } from 'src/modules/histories/services/histories.service';
import { ApolloError } from 'apollo-server-express';
@Injectable()
export class UsersService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly historyService: HistoryService,
  ) {}
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
    const wakeUpTime = new Date();
    wakeUpTime.setDate(wakeUpTime.getDate() - 1);
    wakeUpTime.setHours(22);
    wakeUpTime.setMinutes(0);

    const sleepTime = new Date();
    sleepTime.setDate(sleepTime.getDate());
    sleepTime.setHours(16);
    sleepTime.setMinutes(0);

    user.wakeUpTime = wakeUpTime;
    user.sleepTime = sleepTime;

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(userRegisterInput.password, salt);
    user.passwordSalt = salt;
    return this.userRepository.save(user);
  }

  async updateUserVapidKey(
    user: UserEntity,
    vapidKey: string,
  ): Promise<string> {
    const updated = await this.userRepository.save({ ...user, vapidKey });
    return updated.vapidKey;
  }

  async updateUserSetting(input: UpdateUserSettingInput, user: UserEntity) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // find tomorrow history
      const tomorrowHistory = await this.historyService.latestHistory(user);
      if (!tomorrowHistory) {
        throw new NotFoundException('Not Found Tomorrow History !');
      }

      // delete tomorrow history
      queryRunner = await this.historyService.deleteHistory(
        queryRunner,
        tomorrowHistory.id,
      );

      // updated user
      const updatedUser: UserEntity = { ...user, ...input };

      // create new tomorrow history
      const tomorrowQRHistory =
        await this.historyService.createHistoryAndMetadata(
          queryRunner,
          updatedUser,
          tomorrow,
        );
      queryRunner = tomorrowQRHistory.queryRunner;

      // update user
      await queryRunner.manager.save(UserEntity, updatedUser);
      await queryRunner.commitTransaction();
      return updatedUser;
    } catch (error) {
      console.log(JSON.stringify(error));
      await queryRunner.rollbackTransaction();

      throw new ApolloError('Save getHistory unsuccessfully !');
    } finally {
      await queryRunner.release();
    }
  }
}
