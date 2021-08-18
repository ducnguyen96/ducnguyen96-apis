import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { json } from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import * as admin from 'firebase-admin';

const PORT = parseInt(process.env.PORT ?? '3001', 10);
process.env.TZ = 'GMT';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [
        /http:\/\/localhost.*/,
        /https:\/\/ducnguyen96.github.io.*/,
        /.*.cloudflare.com.*/,
        /.*ducnguyen96.xyz.*/,
      ],
    },
    bodyParser: true,
  });

  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: process.env.client_email,
      privateKey: process.env.private_key?.replace(/\\n/g, '\n'),
      projectId: process.env.project_id,
    }),
  });

  // app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: true,
      validateCustomDecorators: false,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => {
        const errData: Record<string, any> = {};
        errors.map((v) => {
          errData[v.property] = v.constraints;
        });
        // throw new UserInputError('Validation failed', errData);
        throw new Error('Validation failed');
      },
    }),
  );

  app.use(json({ limit: '5mb' })); //The default limit defined by body-parser is 100kb
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.use(compression());

  await app.listen(PORT);
  console.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});
