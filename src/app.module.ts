import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UsersModule, MongooseModule.forRoot('mongodb+srv://hoiNgocTuan:CpY4Ue0ah5PMWOIX@cluster0.qseat.mongodb.net/')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
