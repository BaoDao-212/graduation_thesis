import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  ApikeyController } from './openai.resolver';
import { Apikey } from 'src/entities/apikey.entity';
import { User } from 'src/entities/user.entity';
import { ApikeyService } from './openai.service';
import { Exam } from 'src/entities/exam.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Result } from 'src/entities/result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Apikey, User,Exam,Result]),
 ],
  providers: [ApikeyService, ApikeyController],
  controllers: [ApikeyController],
})
export class ApikeyModule {}
