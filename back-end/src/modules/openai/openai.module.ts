import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  ApikeyController } from './openai.resolver';
import { Apikey } from 'src/entities/apikey.entity';
import { User } from 'src/entities/user.entity';
import { ApikeyService } from './openai.servive';
import { Exam } from 'src/entities/exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Apikey, User,Exam])],
  providers: [ApikeyService, ApikeyController],
  controllers: [ApikeyController],
})
export class ApikeyModule {}
