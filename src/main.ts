import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { CustomLogger } from './app/logger/logger.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cluster from 'cluster';
import { cpus } from 'os';

const numCPUs = cpus().length;

if ((cluster as any).isPrimary) {
  console.log(`Primary server ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    (cluster as any).fork();
  }

  (cluster as any).on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log('Forking a new worker');
    (cluster as any).fork();
  });
} else {
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
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(process.env.PORT ?? 3001);
    console.log('Server is running on port', process.env.PORT ?? 3001);
  }
  bootstrap();
}
