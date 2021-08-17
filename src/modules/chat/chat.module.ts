import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { UsersModule } from '../users/users.module';
import { MainGateway, MusicGateway, TechGateway } from './chat.gateways';
import {
  MessageRepository,
  RoomRepository,
} from './repositories/chat.repositories';
import { MessageResolver } from './resolvers/messages.resolver';
import { MessageFieldResolver } from './resolvers/message_fields.resolver';
import { RoomResolver } from './resolvers/room.resolver';
import { MessageService } from './services/message.service';
import { RoomService } from './services/room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomRepository, MessageRepository]),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        secretOrPrivateKey: configService.authConfig.jwtSecret,
        // if you want to use token with expiration date
        // signOptions: {
        //     expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
        // },
      }),
      inject: [ApiConfigService],
    }),
    UsersModule,
  ],
  providers: [
    MainGateway,
    MusicGateway,
    TechGateway,

    // Resolvers
    RoomResolver,
    MessageResolver,
    MessageFieldResolver,

    // Services
    RoomService,
    MessageService,
  ],
})
export class ChatModule {}
