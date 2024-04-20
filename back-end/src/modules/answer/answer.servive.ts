import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Exam } from 'src/entities/exam.entity';
import { Answer } from 'src/entities/answer.entity';
import { CreateAnswerInput, CreateAnswerOutput } from './answer.dto';
import { Question } from 'src/entities/question.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
    @InjectRepository(Question) private readonly questionRepo: Repository<Question>,
  ) { }
  async createAnswer(
    input: CreateAnswerInput,
    currentUser: User,
  ): Promise<CreateAnswerOutput> {
    try {
      const { questionId, content, isCorrect } = input;
     const question = await this.questionRepo.findOne(
        {
          where: { id: questionId },
          relations: {
            exam: true,
          },
          },
      );
      if(!question)
        return createError('Question', 'Question not found');
      const exam = await this.examRepo.findOne(
        {
          where: { id: question.exam.id },
          relations: {
            user: true,
          },
        }
      );
      if(exam.user.id!==currentUser.id)
      return createError('Exam', 'You are not allowed to create answer in this exam')
      const answer = await this.answerRepo.create({
       answer:content,
       isCorrect,
       question,
      });
      await this.answerRepo.save(answer);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

}
