import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import compression from '@fastify/compress';
import { constants } from 'zlib';
import helmet from '@fastify/helmet'
import { VersioningType } from '@nestjs/common';
import fastifyCsrf from '@fastify/csrf-protection';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({logger:true})
  );
  await app.register(helmet)
  await app.register(compression, {encodings: ['gzip', 'deflate'], brotliOptions: { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } } });
  await app.register(fastifyCsrf);


  app.enableCors();
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'api-version',
  });


  await app.listen(5000,'0.0.0.0');
}
bootstrap();