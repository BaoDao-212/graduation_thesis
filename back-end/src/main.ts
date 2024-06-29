import { Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import { ApiTransformInterceptor } from './common/api.transform';
import { ConfigService } from '@nestjs/config';
const SERVER_PORT = 45615;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
    },
  });

  const config = app.get(ConfigService);

  app.enableCors();

  app.useGlobalInterceptors(new ApiTransformInterceptor(new Reflector()));

  // swagger
  // setupSwagger(app);
  // start
  Logger.log(`Server port: ${SERVER_PORT}`);
  await app.listen(SERVER_PORT, '0.0.0.0');
  const serverUrl = await app.getUrl();
  Logger.log(`api服务已经启动,请访问: ${serverUrl}`);
  Logger.log(`API文档已生成,请访问: ${serverUrl}${process.env.SWAGGER_PATH}/`);
}

bootstrap();
