import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryModule } from '../histories/histories.module';
import { UserRepository } from './repositories/users.repository';
import { UsersMutationsResolver } from './resolvers/users_mutations.resolver';
import { UsersQueriesResolver } from './resolvers/users_queries.resolver';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), HistoryModule],
  providers: [
    // Services
    UsersService,

    // Resolvers
    UsersQueriesResolver,
    UsersMutationsResolver,
  ],
  exports: [UsersService],
})
export class UsersModule {}
