import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { CreateExamInput, CreateExamOutput} from './exam.dto';
import { Post, PostStatus } from 'src/entities/post.entity';
import { Exam } from 'src/entities/exam.entity';
import { CoreOutput } from '../common/output.dto';

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
    const {content,name,level } = input;
    const exam = await this.examRepo.create({
      content: content,
      user: currentUser,
      name: name,
      level: level,
    });
    await this.examRepo.save(exam);
    return {
      ok: true,
    };
    
  } catch (error) {
    return createError('Server', 'Lỗi server, thử lại sau');
  }
}

}
