import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { CustomLogger } from './app/logger/logger.service';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
