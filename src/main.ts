import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { CustomLogger } from './app/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
  console.log('Server is running on port', process.env.PORT ?? 3001);
}
bootstrap();
