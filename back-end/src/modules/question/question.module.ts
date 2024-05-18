import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionService } from './question.servive';
import {  QuestionController } from './question.resolver';
import { Question } from 'src/entities/question.entity';
import { Exam } from 'src/entities/exam.entity';
import { Answer } from 'src/entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question,Exam,Answer])],
  providers: [QuestionService, QuestionController],
  controllers: [QuestionController],
})
export class QuestionModule {}
