import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository,In } from 'typeorm';
import { createError } from '../common/utils/createError';
import { CreateExamInput, CreateExamOutput, ListExamInput, ListExamOutput} from './exam.dto';
import { Exam, ExamStatus } from 'src/entities/exam.entity';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
 
async createExam(
  input: CreateExamInput,
  currentUser: User,
): Promise<CreateExamOutput> {
  try {
    const {content,name,level,status } = input;
    const exam = await this.examRepo.create({
      content,
      user: currentUser,
      name,
      level,
      status,
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
async listExams(currentUser: User, input: ListExamInput): Promise<ListExamOutput> {
    try {
      const {page,pageSize} = input;
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      // dem so luong exam cua current user
      const [_allExams,total] = await this.examRepo.findAndCount({
        where: {
          user: {
            id: currentUser.id,
          },
        },
      });
      if (total === 0 || skip >= total ) {
        return createError('Page', 'Page is invalid');
      }
      // lay danh sach exam cua current user
      const exams = await this.examRepo.find({
        where: {
          user: {
            id: currentUser.id,
          },
          status: In([ExamStatus.ACTIVE, ExamStatus.INACTIVE]),
        },
        select: ['id','createdAt', 'name','level','status','content'],
        skip,
        take,
        order: {
          createdAt: 'DESC',
        },
      });
      console.log(exams);
      
      return {
        ok: true,
        exams,
        total,
      };
  } catch (error) {
    console.log(error);
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
      select: ['id','name','content'],
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
}