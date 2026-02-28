import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import configuration from './config/configuration';

@Module({
    imports: [
        // MongooseModule.forRoot('mongodb+srv://askAutomation:U40FreolxBoZQqtq@cluster0.qseat.mongodb.net/'),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URL'),
            }),
            inject: [ConfigService],
        }),

        // ConfigModule.forRoot({
        //     isGlobal: true,
        // }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid('development', 'production', 'test', 'provision')
                    .default('development'),
                PORT: Joi.number().port().default(3000),
                DATABASE_HOST: Joi.string().required(),
                DATABASE_PORT: Joi.number().default(5432),
            }),
        }),

        UsersModule,

        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
