import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Exam } from 'src/entities/exam.entity';
import { Question } from 'src/entities/question.entity';
import { CreateQuestionInput, CreateQuestionOutput } from './question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private readonly questionRepo: Repository<Question>,
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
  ) { }
  async createQuestion(
    input: CreateQuestionInput,
    currentUser: User,
  ): Promise<CreateQuestionOutput> {
    try {
      const { examId, content, explaination } = input;
      const exam = await this.examRepo.findOne(
        {

          where: { id: examId },
          relations: {
            user: true,
          },
        }
      );
      if (!exam) {
        return createError('Exam', 'Not found exam');
      }
      if(exam.user.id!==currentUser.id)
      return createError('Exam', 'You are not allowed to create question in this exam')
      const question = await this.questionRepo.create({
        content,
        explaination,
        exam,
      });
      await this.questionRepo.save(question);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

}
