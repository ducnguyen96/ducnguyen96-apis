import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthGuardRequired } from 'src/guards/auth.guard';
import { HistoryMetadataEntity } from '../entities/histories_metadata.entity';
import { HistoryMetadataService } from '../services/history_metadata.service';

@Resolver(() => HistoryMetadataEntity)
export class HistoryMetadataQueryResolver {
  constructor(
    private readonly historyMetadataService: HistoryMetadataService,
  ) {}

  @Query(() => [HistoryMetadataEntity], {
    nullable: false,
  })
  @UseGuards(AuthGuardRequired)
  getHistoryMetadata(
    @Args('historyId', {
      nullable: false,
    })
    id: string,
  ) {
    if (id.length === 1) return [];
    return this.historyMetadataService.getHistoryMetadata(id);
  }
}
