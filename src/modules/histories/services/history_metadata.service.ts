import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationService } from 'src/modules/notification/notification.service';
import { UserEntity } from 'src/modules/users/entities/users.entity';
import { FindConditions } from 'typeorm';
import { UpdateHistoryMetadataInput } from '../dtos/UpdateHistoryMetadata.input';
import { HistoryMetadataEntity } from '../entities/histories_metadata.entity';
import {
  HistoryMetadataRepository,
  HistoryRepository,
} from '../repositories/histories.repository';

@Injectable()
export class HistoryMetadataService {
  constructor(
    public readonly historyMetadataRepository: HistoryMetadataRepository,
    public readonly historyRepository: HistoryRepository,
    public readonly notificationService: NotificationService,
  ) {}

  findOne(
    findData: FindConditions<HistoryMetadataEntity>,
  ): Promise<HistoryMetadataEntity | undefined> {
    return this.historyMetadataRepository.findOne(findData);
  }

  getHistoryMetadata = async (id: string): Promise<HistoryMetadataEntity[]> => {
    return this.historyMetadataRepository.find({
      where: {
        historyId: id,
      },
      order: {
        drankAt: 'ASC',
        drinkAt: 'ASC',
      },
    });
  };

  updateHistoryMetadata = async (
    input: UpdateHistoryMetadataInput,
    user: UserEntity,
  ): Promise<HistoryMetadataEntity> => {
    const foundEntity = await this.historyMetadataRepository.findOne({
      where: { id: input.id },
    });
    if (!foundEntity) throw new NotFoundException('Metadata Not Found !');
    const history = this.historyRepository.findOneOrFail(foundEntity.historyId);
    if (input.drankAt) {
      history.then((data) => {
        data.progress = data.progress + foundEntity.drinkAtATime;
        this.historyRepository.save(data);
      });
    }
    if (input.drinkAt !== foundEntity.drinkAt && !foundEntity.drankAt) {
      this.notificationService.cancelScheduleJob(input.id);
      foundEntity.drinkAt = input.drinkAt;
      this.notificationService.scheduleThisJob(user, foundEntity);
    }
    return this.historyMetadataRepository.save({ ...foundEntity, ...input });
  };
}
