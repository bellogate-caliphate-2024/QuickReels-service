"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
const logger_service_1 = require("./app/logger/logger.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: new logger_service_1.CustomLogger(),
    });
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    await app.listen(process.env.PORT ?? 3001);
    console.log('Server is running on port', process.env.PORT ?? 3001);
}
bootstrap();
//# sourceMappingURL=main.js.map