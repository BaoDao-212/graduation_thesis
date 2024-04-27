import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Exam } from 'src/entities/exam.entity';
import { Question } from 'src/entities/question.entity';
import { QuestionInput, CreateQuestionOutput, ListQuestionOutput, QuestionOutput } from './question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private readonly questionRepo: Repository<Question>,
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
  ) { }
  async createQuestion(
    input: QuestionInput,
    currentUser: User,
  ): Promise<CreateQuestionOutput> {
    try {
      const { examId, content, explaination,level } = input;
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
        level,
      });
      await this.questionRepo.save(question);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // lấy danh sách câu hỏi
  async getQuestionByExamId(examId: number,currentUser:User):Promise<ListQuestionOutput> {
    try {
      const exam = await this.examRepo.findOne(
        {
          where: { id: examId },
          relations: {
            user: true,
          },
        }
      );
      if(!exam) return createError('Exam', 'Not found exam');
      if(exam.user.id!==currentUser.id) return createError('Exam', 'You are not allowed to get question in this exam');
      const questions = await this.questionRepo.find(
        {
          where: { exam: {
            id: examId
          } },
        }
      );
      return {
        ok: true,
        questions,
      }
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // lấy thông tin chi tiết của một câu hỏi
  async getQuestionById(id: number,currentUser:User): Promise<QuestionOutput> {
    try {
      const question = await this.questionRepo.findOne(
        {
          where: { id },
          relations: {
            exam: {
              user: true,
            },
            answers: true,
          },
        }
      );

      console.log(question);
      
      if (!question) {
        return createError('Question', 'Not found question');
      }
      if(question.exam.user.id!==currentUser.id) return createError('Question', 'You are not allowed to get this question');
      return {
        ok:true,
        question:question,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // cập nhật dữ liệu cho một câu hỏi
  async updateQuestion(input: QuestionInput, currentUser: User,questionId:number): Promise<QuestionOutput> {
    try {
      const { examId, content, explaination,level } = input;
      const question =await this.questionRepo.findOne({
        where:{id:questionId},
        relations:{
          exam:{
            user:true,
          }
        }
      });
      if(!question) return createError('Question', 'Not found question');
      if(question.exam.user.id!==currentUser.id) return createError('Question', 'You are not allowed to update this question');
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
      question.exam= exam;
      question.content=content;
      question.explaination=explaination;
      question.level=level;
      await this.questionRepo.save(question);
      return {
        ok: true,
        question,
      };
    }
    catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
    }
}
