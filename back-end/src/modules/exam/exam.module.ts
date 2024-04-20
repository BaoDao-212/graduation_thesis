import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamService } from './exam.servive';
import { ExamController } from './exam.resolver';
import { User } from 'src/entities/user.entity';
import { Exam } from 'src/entities/exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Exam,User])],
  providers: [ExamService, ExamController],
  controllers: [ExamController],
})
export class ExamModule {}
