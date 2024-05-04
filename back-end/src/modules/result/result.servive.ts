import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository,In } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Exam, ExamStatus } from 'src/entities/exam.entity';
import { Result } from 'src/entities/result.entity';
import {  ResultInput, ResultOutput } from './result.dto';
import { Question } from 'src/entities/question.entity';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result) private readonly resultRepo: Repository<Result>,
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
  ) { }
  async createResult(
    input: ResultInput,
    currentUser: User,
  ): Promise<ResultOutput> {
    try {
      const { examId } = input;
      const exam = await this.examRepo.findOne({
        where:{
          id:examId,
          status:In([ExamStatus.ACTIVE,ExamStatus.INACTIVE]),
        },
      });
      if (!exam) {
        return createError('Exam', 'Không tìm thấy thi');
      }
      const result= await this.resultRepo.create({
        exam,
        user: currentUser,
      });
      return {
        ok: true,
        result,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

}
