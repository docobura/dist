"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.enableCors({
        origin: 'http://localhost:8000',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('jwt token')
        .setDescription('This is a jwt token API description')
        .setVersion('1.0')
        .addTag('funtions')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(8000);
}
bootstrap();
//# sourceMappingURL=main.js.map