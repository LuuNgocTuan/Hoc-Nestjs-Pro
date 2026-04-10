import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import *as dns from 'dns';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

dns.setServers(['1.1.1.1', '8.8.8.8']);
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const reflector = app.get(Reflector);
    // app.useGlobalGuards(new JwtAuthGuard(reflector));

    app.useStaticAssets(join(__dirname, '..', 'public'));//static files like css, img
    app.setBaseViewsDir(join(__dirname, '..', 'views')); //views
    app.setViewEngine('ejs');

    console.log('check path:', join(__dirname, '..', 'public'), join(__dirname, '..', 'views'));
    // const PORT = Number(process.env.PORT)

    app.useGlobalPipes(new ValidationPipe());

    const configService = app.get(ConfigService);
    const port = configService.get('PORT');

    app.enableCors(
        {
            "origin": "http://localhost:3000",
            "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
            "preflightContinue": false,
            "optionsSuccessStatus": 204
        }
    );
    await app.listen(port);

}
bootstrap();
