import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/users.repository';
import { UsersQueriesResolver } from './resolvers/users_queries.resolver';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [
    // Services
    UsersService,

    // Resolvers
    UsersQueriesResolver,
  ],
  exports: [UsersService],
})
export class UsersModule {}
