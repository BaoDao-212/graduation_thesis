import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository,In,DataSource } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Exam, ExamStatus } from 'src/entities/exam.entity';
import { Result } from 'src/entities/result.entity';
import {  DetailResultInput, ResultInput, ResultOutput } from './result.dto';
import { DetailResult } from 'src/entities/detail-result.entity';
import { Question } from 'src/entities/question.entity';
import { Answer } from 'src/entities/answer.entity';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result) private readonly resultRepo: Repository<Result>,
    @InjectRepository(DetailResult) private readonly detailResultRepo: Repository<DetailResult>,
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
    @InjectRepository(Question) private readonly questionRepo: Repository<Question>,
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
    private dataSource: DataSource,
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
      console.log(exam);
      if (!exam) {
        return createError('Exam', 'Exam not found');
      }
      const result= await this.resultRepo.create({
        exam,
        user: currentUser,
      });
      console.log(result);
      await this.resultRepo.save(result);
      return {
        ok: true,
        result,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
// lấy thông tin chi tiết của một bài làm
  async getResultDetail(
    id: number,
    currentUser: User,
  ): Promise<ResultOutput> {
    try {
      const result = await this.resultRepo.createQueryBuilder('result')
      .where('result.id = :id', { id })
      .andWhere('result.user.id = :userId', { userId: currentUser.id })
      .leftJoinAndSelect('result.exam', 'exam')
      .leftJoinAndSelect('result.user','user')
      .leftJoinAndSelect('result.detailResult', 'detailResult')
      .leftJoinAndSelect('detailResult.question', 'question')
      .leftJoinAndSelect('detailResult.answer', 'answer')
      .select(['result.id','result.score','result.createdAt'])
      .addSelect(['exam.id','exam.name','exam.level','exam.status'])
      .addSelect(['detailResult.id','detailResult.question',])
      .addSelect(['question.id','question.content'])
      .addSelect(['answer.id','answer.answer'])
      .getOne();
      if (!result) {
        return createError('Result', 'Result not found');
      }
      if(result.score!=-1) return createError('Result', 'Result already submitted' );
      return {
        ok: true,
        result,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
// nộp đáp án của một câu hỏi lên server
  async submitAnswer(
   input:DetailResultInput,
    currentUser: User,
  ): Promise<ResultOutput> {
    try {
      const {answerId,resultId,questionId}=input;
      const result = await this.resultRepo.findOne({
        where: {
          id: resultId,
          user: {
            id: currentUser.id,
          },
        },
        relations: ['exam'],
      });
      if (!result) {
        return createError('Result', 'Result not found');
      }
      if(result.score!=-1) return createError('Result', 'Result already submitted' );
      const question = await this.questionRepo.findOne({
        where: {
          id: questionId,
          exam: {
            id: result.exam.id,
          },
        },
        relations: ['exam','answers'],
      });
      if (!question) {
        return createError('Question', 'Question not found');
      }
      
      const answer = await this.answerRepo.find({
        where: {
          id: In(answerId),
          question: {
            id: question.id,
          },
        },
        relations: ['question'],
      });
      if (!answer) {
        return createError('Answer', 'Answer not found');
      }
      
      // thực hiện transaction chỗ này
      const oldDetailResultArray = await this.detailResultRepo.find({
        where: {
          result: {
            id: result.id,
          },
          question: {
            id: question.id,
          },
        },
        relations: ['question', 'result'],
      });
      // start transaction 

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
        try {
          // Xoá các old DetailResult
          if(oldDetailResultArray.length > 0)
            await queryRunner.manager.remove(oldDetailResultArray);
          const answerCorrectOfQuestion = question.answers.filter((a) => a.isCorrect);
          const answerCorrectUser = answer.filter((a) => a.isCorrect);
          let score=answerCorrectUser.length==answerCorrectOfQuestion.length?1:0;
          if(answer.filter((a) => !a.isCorrect).length>0)
            score=0;
          // Tạo các new DetailResult
          await queryRunner.manager.save(DetailResult,{
            result,
            answer,
            question,
            score,
          });
          await queryRunner.commitTransaction();
          return {
            ok: true,
          };
        } catch (err) {
          // since we have errors lets rollback the changes we made
          await queryRunner.rollbackTransaction();
          return createError('Server', 'Lỗi server, thử lại sau');
        } finally {
          // you need to release a queryRunner which was manually instantiated
          await queryRunner.release();
        }
      // end transaction
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // tính điểm cho một bài làm
  async calculateScore(
    resultId: number,
    currentUser: User,
  ): Promise<ResultOutput> {
    try {
      const result = await this.resultRepo.findOne({
        where: {
          id: resultId,
          user: {
            id: currentUser.id,
          },
        },
        relations: ['exam'],
      });
      if (!result) {
        return createError('Result', 'Result not found');
      }
      if(result.score!=-1) return {ok:true,result};
      const detailResults = await this.detailResultRepo.find({
        where: {
          result: {
            id: result.id,
          },
        },
      });
      if (!detailResults) {
        return createError('Detail Result', 'Detail result not found');
      }
      const score = detailResults.reduce((acc, detailResult) => {
        return acc + detailResult.score;
      } ,0);
      result.score = score;
      await this.resultRepo.save(result);
      return {
        ok: true,
        result,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
