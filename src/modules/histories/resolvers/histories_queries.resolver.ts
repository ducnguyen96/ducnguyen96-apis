import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthGuardRequired } from 'src/guards/auth.guard';
import { UserEntity } from 'src/modules/users/entities/users.entity';
import { HistoryEntity } from '../entities/histories.entity';
import { HistoryService } from '../services/histories.service';

@Resolver(() => HistoryEntity)
export class HistoryQueryResolver {
  constructor(private readonly historyService: HistoryService) {}

  @Query(() => [HistoryEntity])
  @UseGuards(AuthGuardRequired)
  getHistory(@AuthUser() user: UserEntity) {
    return this.historyService.getHistory(user);
  }

  // @Query(() => String)
  // @UseGuards(OptAuthGuard)
  // async test(@AuthUser() user: UserEntity) {
  //   const history = await this.historyService.findOne({ userId: user.id });
  //   if (!history) return;
  //   const meta = await this.historyMetadataService.findOne({
  //     historyId: history.id,
  //   });
  //   if (!meta) return;
  //   this.notificationService.testNotification(user, meta);
  //   return 'ok';
  // }
}
