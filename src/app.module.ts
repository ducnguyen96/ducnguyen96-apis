import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UpperCaseDirective } from './graphql/directives/UpperCaseDirective';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { contextMiddleware } from './middlewares/context.middleware';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ChatModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.typeOrmConfig,
      inject: [ApiConfigService],
    }),
    GraphQLModule.forRootAsync({
      imports: [UsersModule],
      useFactory: async () => ({
        path: '/graphql',
        tracing: true,
        uploads: {
          maxFieldSize: 100 * 1000000, // 100MB
          maxFileSize: 50 * 1000000, // 50 MB
          maxFiles: 20,
        },
        playground: false,
        debug: false,
        installSubscriptionHandlers: false,
        autoSchemaFile: true,
        schemaDirectives: {
          upper: UpperCaseDirective,
        },
        context: ({ req, res, payload, connection }: any) => ({
          req,
          res,
          payload,
          connection,
        }),
        resolverValidationOptions: {
          // requireResolversForResolveType: false,
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes('*');
  }
}
