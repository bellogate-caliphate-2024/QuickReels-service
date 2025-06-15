import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { CustomLogger } from './app/logger/logger.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('QuickReels API')
    .setDescription('API documentation for QuickReels')
    .setVersion('1.0')
    .addBearerAuth() // For Authorization: Bearer <token>
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Accessible at http://localhost:3001/api/docs

  await app.listen(process.env.PORT ?? 3001);
  console.log('Server is running on port', process.env.PORT ?? 3001);
}
bootstrap();
