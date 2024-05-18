import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository,In } from 'typeorm';
import { createError } from '../common/utils/createError';
import { ExamInput, CreateExamOutput, ListExamInput, ListExamOutput, ExamOutput} from './exam.dto';
import { Exam, ExamStatus } from 'src/entities/exam.entity';

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
    });
    if (!exam) {
      return createError('Exam', 'Không tìm thấy đề thi');
    }
    const {content,name,level,status } = input;
    exam.content = content;
    exam.name = name;
    exam.level = level;
    exam.status = status;
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
   
    const exam = await this.examRepo.createQueryBuilder('exam')
    .where('exam.id = :id', { id })
    .andWhere('exam.status = :status', { status: ExamStatus.ACTIVE })
    .leftJoinAndSelect('exam.questions', 'question')
    .leftJoinAndSelect('question.answers', 'answer')
    .select(['exam.id','exam.name','exam.level','exam.status','exam.content'])
    .addSelect(['question.id','question.content'])
    .addSelect(['answer.id', 'answer.answer','answer.isCorrect'])
    .getOne();
    console.log(exam);
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
//TODO: tạo ra một bộ đề kết hợp assistant của openai
async generateQuestions(file: any, examId: number): Promise<any> {
  try {
    const exam = await this.examRepo.findOne({
      where: {
        id: examId,
        status: ExamStatus.ACTIVE,
      },
    });
    if (!exam) {
      return createError('Exam', 'Không tìm thấy đề thi');
    }
    const { content } = exam;
    // gửi file lên openai để tạo câu hỏi
    
    // code here
    return {
      ok: true,
    };  
  }
  catch (error) {
    return createError('Server', 'Lỗi server, thử lại sau');
  }
}
}