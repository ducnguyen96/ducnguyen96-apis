import { Injectable, NotFoundException } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import {
  DrinkSchedule,
  QueryRunnerHistory,
} from 'src/helpers/common.interfaces';
import { NotificationService } from 'src/modules/notification/notification.service';

import { UserEntity } from 'src/modules/users/entities/users.entity';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { FindConditions, getConnection, QueryRunner } from 'typeorm';
import { HistoryEntity } from '../entities/histories.entity';
import { HistoryMetadataEntity } from '../entities/histories_metadata.entity';
import { HistoryRepository } from '../repositories/histories.repository';

@Injectable()
export class HistoryService {
  constructor(
    public readonly historyRepository: HistoryRepository,
    public readonly configService: ApiConfigService,
    public readonly notificationService: NotificationService,
  ) {}

  findOne(
    findData: FindConditions<HistoryEntity>,
  ): Promise<HistoryEntity | undefined> {
    return this.historyRepository.findOne(findData);
  }

  hourToDate = (hour): Date => {
    const time = hour.split(':');
    const date = new Date();
    date.setHours(+time[0]);
    date.setMinutes(+time[1]);
    return date;
  };

  calculateDrinkScheduleForUser = (
    user: UserEntity,
    date: Date,
  ): DrinkSchedule[] => {
    const { wakeUpTime, sleepTime, drinkAtATime, dailyIntake } = { ...user };
    const awakeTime: number =
      Math.abs(new Date(sleepTime).getTime() - new Date(wakeUpTime).getTime()) /
      60000;

    const drinkTimes = dailyIntake / drinkAtATime;
    const fullTakes = Math.floor(drinkTimes);
    const totalTakes = Math.round(drinkTimes);
    const leftTake =
      drinkTimes > fullTakes ? dailyIntake - fullTakes * drinkAtATime : 0;

    const takeLast = Math.floor(awakeTime / totalTakes);

    if (wakeUpTime.getDate() !== sleepTime.getDate()) {
      date.setDate(date.getDate() - 1);
    }
    const drinkSchedule: DrinkSchedule[] = Array(totalTakes);
    for (let index = 0; index < fullTakes; index++) {
      const time = new Date(date);
      time.setHours(wakeUpTime.getHours());
      if (index === 0) {
        time.setMinutes(wakeUpTime.getMinutes());
      } else {
        time.setMinutes(time.getMinutes() + takeLast * index);
      }
      drinkSchedule[index] = {
        time,
        volume: drinkAtATime,
      };
    }

    if (leftTake) {
      const time = new Date(date);
      time.setHours(wakeUpTime.getHours());
      time.setMinutes(time.getMinutes() + takeLast * fullTakes);
      drinkSchedule[drinkSchedule.length - 1] = {
        time,
        volume: leftTake,
      };
    }
    return drinkSchedule;
  };

  fakeHistory = async (user: UserEntity) => {
    const date = new Date('2021-07-16 08:37:00');
    let queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const queryRunnerTodayHistory = await this.createHistoryAndMetadata(
      queryRunner,
      user,
      date,
    );
    queryRunner = queryRunnerTodayHistory.queryRunner;
    await queryRunner.commitTransaction();
  };

  createHistoryAndMetadata = async (
    qr: QueryRunner,
    user: UserEntity,
    date: Date,
  ): Promise<QueryRunnerHistory> => {
    // history
    const history = new HistoryEntity({
      containerVolume: user.containerVolume,
      drinkAtATime: user.drinkAtATime,
      goal: user.dailyIntake,
      userId: user.id,
      createdAt: date,
      updatedAt: date,
    });
    const savedHistory = await qr.manager.save(history);

    // create schedule
    const drinkSchedule: DrinkSchedule[] = this.calculateDrinkScheduleForUser(
      user,
      date,
    );

    // metadata
    const historyMetadata = drinkSchedule.map((schedule) => {
      const newMeta = new HistoryMetadataEntity({
        historyId: savedHistory.id,
        drinkAt: schedule.time,
        drinkAtATime: schedule.volume,
        containerVolume: user.containerVolume,
        createdAt: date,
        updatedAt: date,
      });
      this.notificationService.scheduleThisJob(user, newMeta);
      return newMeta;
    });
    await qr.manager.save(historyMetadata);
    return { queryRunner: qr, history: savedHistory };
  };
  getHistory = async (user: UserEntity): Promise<HistoryEntity[]> => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const afterTomorrow = new Date(today);
    afterTomorrow.setDate(today.getDate() + 2);

    let queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tomorrowHistory = await this.historyRepository
        .createQueryBuilder('h')
        .where('h.created_at::date = :tomorrow::date', { tomorrow })
        .andWhere('h.userId = :userId', { userId: user.id })
        .getOne();

      const todayHistory = await this.historyRepository
        .createQueryBuilder('h')
        .where('h.created_at::date = :today::date', { today })
        .andWhere('h.userId = :userId', { userId: user.id })
        .getOne();

      if (!todayHistory) {
        // create history and metadata for today
        const queryRunnerTodayHistory = await this.createHistoryAndMetadata(
          queryRunner,
          user,
          today,
        );
        queryRunner = queryRunnerTodayHistory.queryRunner;
        await queryRunner.commitTransaction();
      }

      if (!tomorrowHistory) {
        // create history and metadata for today
        const queryRunnerTomorrowHistory = await this.createHistoryAndMetadata(
          queryRunner,
          user,
          tomorrow,
        );
        queryRunner = queryRunnerTomorrowHistory.queryRunner;
        await queryRunner.commitTransaction();
      }

      const qb = await this.historyRepository.createQueryBuilder('h');
      qb.where(`h.created_at::date < :afterTomorrow::date`, {
        afterTomorrow,
      })
        .andWhere(`h.userId = :userId`, { userId: user.id })
        .orderBy(`h.created_at`, 'ASC');

      const histories = await qb.getMany();
      return histories;
    } catch (error) {
      console.log(JSON.stringify(error));
      await queryRunner.rollbackTransaction();

      throw new ApolloError('Save getHistory unsuccessfully !');
    } finally {
      await queryRunner.release();
    }
  };

  deleteHistory = async (qr: QueryRunner, historyId: string) => {
    const history = await this.historyRepository.findOne({
      where: { id: historyId },
    });
    if (!history) throw new NotFoundException('Not Found History');
    const metadata = await qr.manager.find(HistoryMetadataEntity, {
      where: { historyId },
    });
    qr.manager.remove(metadata);
    qr.manager.remove(history);
    return qr;
  };

  latestHistory = async (user: UserEntity) => {
    return this.historyRepository.findOne({
      where: { userId: user.id },
      order: {
        createdAt: 'DESC',
      },
    });
  };
}
