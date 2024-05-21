import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository, In } from 'typeorm';
import { createError } from '../common/utils/createError';
import {
  ExamInput,
  CreateExamOutput,
  ListExamInput,
  ListExamOutput,
  ExamOutput,
  ReviewExamInput,
} from './exam.dto';
import { Exam, ExamStatus } from 'src/entities/exam.entity';
import { CoreOutput } from '../common/output.dto';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createExam(
    input: ExamInput,
    currentUser: User,
  ): Promise<CreateExamOutput> {
    try {
      const { content, name, level, status, time, numberQuestions } = input;
      const exam = await this.examRepo.create({
        content,
        user: currentUser,
        name,
        level,
        status,
        time,
        numberQuestions,
      });
      await this.examRepo.save(exam);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // TODO: lấy danh sách tất cả đề thi exam của current user
  async listExams(
    currentUser: User,
    input: ListExamInput,
  ): Promise<ListExamOutput> {
    try {
      const { page, pageSize } = input;
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      // dem so luong exam cua current user
      const [_allExams, total] = await this.examRepo.findAndCount({
        where: {
          user: {
            id: currentUser.id,
          },
        },
      });
      if (total === 0 || skip >= total) {
        return createError('Page', 'Page is invalid');
      }
      // lay danh sach exam cua current user
      const exams = await this.examRepo.find({
        where: {
          user: {
            id: currentUser.id,
          },
        },
        select: [
          'id',
          'createdAt',
          'name',
          'level',
          'status',
          'content',
          'time',
          'numberQuestions',
        ],
        skip,
        take,
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        ok: true,
        exams,
        total,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  //lấy danh sách tên của tất cả các đề thi của current user
  async listExamNames(currentUser: User): Promise<ListExamOutput> {
    try {
      const exams = await this.examRepo.find({
        where: {
          user: {
            id: currentUser.id,
          },
          status: In([ExamStatus.ACTIVE, ExamStatus.INACTIVE]),
        },
        select: ['id', 'name', 'content','status'],
        order: {
          createdAt: 'DESC',
        },
      });
      return {
        ok: true,
        exams,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // cập nhật thông tin cho một đề thi
  async updateExam(
    input: ExamInput,
    id: number,
    currentUser: User,
  ): Promise<CreateExamOutput> {
    try {
      const exam = await this.examRepo.findOne({
        where: {
          id,
          user: {
            id: currentUser.id,
          },
        },
        relations: ['questions'],
      });
      if (!exam) {
        return createError('Exam', 'Không tìm thấy đề thi');
      }
      const { content, name, level, time, numberQuestions } = input;
      if (exam.questions.length > numberQuestions) {
        return createError('Error', 'Invalid quantity question');
      }
      exam.content = content;
      exam.name = name;
      exam.level = level;
      exam.time = time;
      exam.numberQuestions = numberQuestions;
      await this.examRepo.save(exam);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // lấy thông tin chi tiết của một đề thi
  async getExam(id: number): Promise<ExamOutput> {
    try {
      const exam = await this.examRepo
        .createQueryBuilder('exam')
        .where('exam.id = :id', { id })
        .andWhere('exam.status = :status', { status: ExamStatus.ACTIVE })
        .leftJoinAndSelect('exam.questions', 'question')
        .leftJoinAndSelect('question.answers', 'answer')
        .select([
          'exam.id',
          'exam.name',
          'exam.level',
          'exam.status',
          'exam.content',
        ])
        .addSelect(['question.id', 'question.content'])
        .addSelect(['answer.id', 'answer.answer', 'answer.isCorrect'])
        .getOne();
      if (!exam) {
        return createError('Exam', 'Exam not found');
      }
      return {
        ok: true,
        exam,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  // đánh giá đề thi
  async reviewExam(
    input: ReviewExamInput,
    currentUser: User,
  ): Promise<CoreOutput> {
    try {
      const { examId, amount } = input;
      const exam = await this.examRepo.findOne({
        where: {
          id: examId,
          status: ExamStatus.ACTIVE,
        },
        relations: ['usersReviewed'],
      });
      if (!exam) {
        return createError('Exam', 'Không tìm thấy đề thi');
      }
      exam.numberReviews = exam.numberReviews + 1;
      exam.averageRating = exam.averageRating + amount;
      exam.usersReviewed = [...exam.usersReviewed, currentUser];
      await this.examRepo.save(exam);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // cập nhật trạng thái của đề thi thành deleted
  async deleteExam(id: number, currentUser: User): Promise<CoreOutput> {
    try {
      const exam = await this.examRepo.findOne({
        where: {
          id,
          user: {
            id: currentUser.id,
          },
        },
      });
      if (!exam) {
        return createError('Exam', 'Không tìm thấy đề thi');
      }
      console.log(exam);
      exam.status = ExamStatus.DELETED;
      await this.examRepo.save(exam);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // cập nhật trạng thái của đề thi
  async restoreExam(id: number, currentUser: User): Promise<CoreOutput> {
    try {
      const exam = await this.examRepo.findOne({
        where: {
          id,
          user: {
            id: currentUser.id,
          },
          status: ExamStatus.DELETED,
        },
        relations: ['questions'],
      });
      if (!exam) {
        return createError('Exam', 'Không tìm thấy đề thi');
      }
      if (exam.questions.length == exam.numberQuestions) {
        exam.status = ExamStatus.ACTIVE;
      } else {
        exam.status = ExamStatus.INACTIVE;
      }
      await this.examRepo.save(exam);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
