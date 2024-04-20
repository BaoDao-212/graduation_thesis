import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from 'src/entities/answer.entity';
import { Exam } from 'src/entities/exam.entity';
import { Question } from 'src/entities/question.entity';
import { AnswerService } from './answer.servive';
import { AnswerController } from './answer.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Answer,Question,Exam])],
  providers: [AnswerService, AnswerController],
  controllers: [AnswerController],
})
export class AnswerModule {}
