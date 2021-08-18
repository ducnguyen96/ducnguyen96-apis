import { EntityRepository, Repository } from 'typeorm';
import { HistoryEntity } from '../entities/histories.entity';
import { HistoryMetadataEntity } from '../entities/histories_metadata.entity';

@EntityRepository(HistoryEntity)
export class HistoryRepository extends Repository<HistoryEntity> {}

@EntityRepository(HistoryMetadataEntity)
export class HistoryMetadataRepository extends Repository<HistoryMetadataEntity> {}
