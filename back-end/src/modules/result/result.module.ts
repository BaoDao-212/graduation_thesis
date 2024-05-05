import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from 'src/entities/exam.entity';
import { Result } from 'src/entities/result.entity';
import { ResultController } from './result.resolver';
import { ResultService } from './result.servive';
import { DetailResult } from 'src/entities/detail-result.entity';
import { Answer } from 'src/entities/answer.entity';
import { Question } from 'src/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Result,Exam,DetailResult,Question,Answer])],
  providers: [ResultService, ResultController],
  controllers: [ResultController],
})
export class ResultModule {}
