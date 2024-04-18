// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { Logger } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const logger = new Logger();
//   app.enableCors();

//   await app.listen(3000);
//   logger.log(`Application is running on: ${await app.getUrl()}`);

// }

// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import cluster from 'cluster';
import os from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    logger.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      logger.log(`Worker ${worker.process.pid} died`);
      logger.log('Starting another worker');
      cluster.fork();
    });
  } else {
    await app.listen(3000);

    
    logger.log(`Worker ${process.pid} started`);
  }
}

bootstrap();
