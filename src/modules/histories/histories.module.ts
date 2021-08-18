import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  HistoryMetadataRepository,
  HistoryRepository,
} from './repositories/histories.repository';
import { HistoryQueryResolver } from './resolvers/histories_queries.resolver';
import { HistoryMetadataMutationResolver } from './resolvers/history_metadata_mutation.resolver';
import { HistoryMetadataQueryResolver } from './resolvers/history_metadata_queries.resolver';
import { HistoryService } from './services/histories.service';
import { HistoryMetadataService } from './services/history_metadata.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryRepository, HistoryMetadataRepository]),
  ],
  providers: [
    // Services
    HistoryService,
    HistoryMetadataService,

    // Resolver
    HistoryQueryResolver,
    HistoryMetadataQueryResolver,
    HistoryMetadataMutationResolver,
  ],
  exports: [HistoryService, HistoryMetadataService],
})
export class HistoryModule {}
