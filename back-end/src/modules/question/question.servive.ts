import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Exam, ExamStatus } from 'src/entities/exam.entity';
import { Question } from 'src/entities/question.entity';
import {
  QuestionInput,
  CreateQuestionOutput,
  ListQuestionOutput,
  QuestionOutput,
  CreateQuestioAndAnswerInput,
} from './question.dto';
import { Answer } from 'src/entities/answer.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
  ) {}
  async createQuestion(
    input: QuestionInput,
    currentUser: User,
  ): Promise<CreateQuestionOutput> {
    try {
      const { examId, content, explanation, level } = input;
      const exam = await this.examRepo.findOne({
        where: { id: examId },
        relations: {
          user: true,
        },
      });
      if (!exam) {
        return createError('Exam', 'Not found exam');
      }
      if (exam.user.id !== currentUser.id)
        return createError(
          'Exam',
          'You are not allowed to create question in this exam',
        );
      const question = await this.questionRepo.create({
        content,
        explanation,
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
  async getQuestionByExamId(
    examId: number,
    currentUser: User,
  ): Promise<ListQuestionOutput> {
    try {
      const exam = await this.examRepo.findOne({
        where: { id: examId },
        relations: {
          user: true,
        },
      });
      if (!exam) return createError('Exam', 'Not found exam');
      if (exam.user.id !== currentUser.id)
        return createError(
          'Exam',
          'You are not allowed to get question in this exam',
        );
      const questions = await this.questionRepo.find({
        where: {
          exam: {
            id: examId,
          },
        },
      });
      return {
        ok: true,
        questions,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // lấy thông tin chi tiết của một câu hỏi
  async getQuestionById(
    id: number,
    currentUser: User,
  ): Promise<QuestionOutput> {
    try {
      const question = await this.questionRepo.findOne({
        where: { id },
        relations: {
          exam: {
            user: true,
          },
          answers: true,
        },
      });

      console.log(question);

      if (!question) {
        return createError('Question', 'Not found question');
      }
      if (question.exam.user.id !== currentUser.id)
        return createError(
          'Question',
          'You are not allowed to get this question',
        );
      return {
        ok: true,
        question: question,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // cập nhật dữ liệu cho một câu hỏi
  async updateQuestion(
    input: QuestionInput,
    currentUser: User,
    questionId: number,
  ): Promise<QuestionOutput> {
    try {
      const { examId, content, explanation, level } = input;
      const question = await this.questionRepo.findOne({
        where: { id: questionId },
        relations: {
          exam: {
            user: true,
          },
        },
      });
      if (!question) return createError('Question', 'Not found question');
      if (question.exam.user.id !== currentUser.id)
        return createError(
          'Question',
          'You are not allowed to update this question',
        );
      const exam = await this.examRepo.findOne({
        where: { id: examId },
        relations: {
          user: true,
        },
      });
      if (!exam) {
        return createError('Exam', 'Not found exam');
      }
      if (exam.user.id !== currentUser.id)
        return createError(
          'Exam',
          'You are not allowed to create question in this exam',
        );
      question.exam = exam;
      question.content = content;
      question.explanation = explanation;
      question.level = level;
      await this.questionRepo.save(question);
      return {
        ok: true,
        question,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // thêm câu hỏi và mảng câu trả lời
  async addQuestionAndAnswer(
    input: CreateQuestioAndAnswerInput,
    currentUser: User,
    examId: number,
  ): Promise<QuestionOutput> {
    try {
      const { answers, content, level, explanation } = input;
      const exam = await this.examRepo.findOne({
        where: { id: examId },
        relations: {
          user: true,
          questions:true,
        },
        
      });
      
      if (!exam) return createError('Exam', 'Not found exam');
      if (exam.user.id !== currentUser.id)
        return createError(
          'Exam',
          'You are not allowed to add question in this exam',
        );
      if(exam.questions.length== exam.numberQuestions) return createError('Exam', 'Number of questions is full');

      if(exam.questions.length+1== exam.numberQuestions)
        exam.status = ExamStatus.ACTIVE;
      await this.examRepo.save(exam);
      let question = await this.questionRepo.create({
        content,
        explanation,
        level,
        exam,
      });
      
      question= await this.questionRepo.save(question);
      for (const answer of answers) {
        const ans = await this.answerRepo.create({
          answer: answer.answer,
          isCorrect: answer.isCorrect,
          question,
        });
        await this.answerRepo.save(ans);
      }
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  
}
