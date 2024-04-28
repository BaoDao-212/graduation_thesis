import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Exam } from 'src/entities/exam.entity';
import { Answer } from 'src/entities/answer.entity';
import {  AnswerInput, AnswerListOutput, AnswerOutPut, CreateAnswerOutput } from './answer.dto';
import { Question } from 'src/entities/question.entity';
import { CoreOutput } from '../common/output.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
    @InjectRepository(Question) private readonly questionRepo: Repository<Question>,
  ) { }
  async createAnswer(
    input: AnswerInput,
    currentUser: User,
  ): Promise<CreateAnswerOutput> {
    try {
      const { questionId, answer, isCorrect } = input;
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
      const ans = await this.answerRepo.create({
       answer,
       isCorrect,
       question,
      });
      await this.answerRepo.save(ans);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
// danh sách câu trả lời khi biết id của câu hỏi
  async getAnswerByQuestionId(questionId: number,currentUser:User):Promise<AnswerListOutput> {
    try {
      const question = await this.questionRepo.findOne(
        {
          where: { id: questionId },
          relations: {
            exam: true,
          },
        }
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
      return createError('Exam', 'You are not allowed to get answer in this exam')
      const answers = await this.answerRepo.find({
        where: {
          question: {
            id: questionId,
          },
        },
      });
      return {
        ok:true,
        answers,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // cập nhật thông tin của một trả lời
  async updateAnswer(
    input: AnswerInput,
    currentUser: User,
    id: number,
  ): Promise<AnswerOutPut> {
    try {
      const { questionId, answer, isCorrect } = input;
      const question = await this.questionRepo.findOne(
        {
          where: { id: questionId },
          relations: {
            exam: true,
          },
        }
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
      return createError('Exam', 'You are not allowed to update answer in this exam')
      const ans = await this.answerRepo.findOne({
        where: {
          id,
        },
      });
      if (!ans) {
        return createError('Answer', 'Not found answer');
      }
      ans.answer = answer;
      ans.isCorrect = isCorrect;
      await this.answerRepo.save(ans);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  // xóa một câu trả lời
  async deleteAnswer(
    id: number,
    currentUser: User,
  ): Promise<CoreOutput> {
    try {
      const answer = await this.answerRepo.findOne({
        where: {
          id,
        },
        relations: {
          question: {
            exam: {
              user: true,
            },
          },
        },
      });
      if (!answer) {
        return createError('Answer', 'Not found answer');
      }
      if(answer.question.exam.user.id!==currentUser.id)
      return createError('Exam', 'You are not allowed to delete answer in this exam')
      await this.answerRepo.remove(answer);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
