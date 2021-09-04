import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthGuardRequired } from 'src/guards/auth.guard';
import { UserEntity } from 'src/modules/users/entities/users.entity';
import { UpdateHistoryMetadataInput } from '../dtos/UpdateHistoryMetadata.input';
import { HistoryMetadataEntity } from '../entities/histories_metadata.entity';
import { HistoryMetadataService } from '../services/history_metadata.service';

@Resolver(() => HistoryMetadataEntity)
export class HistoryMetadataMutationResolver {
  constructor(
    private readonly historyMetadataService: HistoryMetadataService,
  ) {}

  @UseGuards(AuthGuardRequired)
  @Mutation(() => HistoryMetadataEntity, {
    nullable: false,
  })
  updateHistoryMetadata(
    @Args('input', {
      nullable: false,
    })
    input: UpdateHistoryMetadataInput,
    @AuthUser() user: UserEntity,
  ) {
    return this.historyMetadataService.updateHistoryMetadata(input, user);
  }
}
