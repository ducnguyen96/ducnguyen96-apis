import { HistoryEntity } from 'src/modules/histories/entities/histories.entity';
import { QueryRunner } from 'typeorm';

export interface DrinkSchedule {
  time: Date;
  volume: number;
}

export interface QueryRunnerHistory {
  queryRunner: QueryRunner;
  history: HistoryEntity;
}
