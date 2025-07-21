"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
const logger_service_1 = require("./app/logger/logger.service");
const swagger_1 = require("@nestjs/swagger");
const cluster = require("cluster");
const os_1 = require("os");
const numCPUs = (0, os_1.cpus)().length;
if (cluster.isPrimary) {
    console.log(`Primary server ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log('Forking a new worker');
        cluster.fork();
    });
}
else {
    async function bootstrap() {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: new logger_service_1.CustomLogger(),
        });
        app.enableCors({
            origin: 'http://localhost:3000',
            credentials: true,
        });
        const config = new swagger_1.DocumentBuilder()
            .setTitle('QuickReels API')
            .setDescription('API documentation for QuickReels')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
        await app.listen(process.env.PORT ?? 3001);
        console.log('Server is running on port', process.env.PORT ?? 3001);
    }
    bootstrap();
}
//# sourceMappingURL=main.js.map