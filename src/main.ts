import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(80);
  console.log("Quickreels-Development-App Listening on port 80...");
  
}
bootstrap();
