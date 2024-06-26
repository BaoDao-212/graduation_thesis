import { ApiProperty } from '@nestjs/swagger';
import { Exam, ExamLevel, ExamStatus } from 'src/entities/exam.entity';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class ExamInput {
  @ApiProperty({ description: 'content' })
  content: string;
  
  @ApiProperty({ description: 'name' })
  name:string;

  @ApiProperty({ description: 'level' })
  level: ExamLevel;

  @ApiProperty({description: 'status'})
  status: ExamStatus;
  @ApiProperty({description: 'time'})
  time?: number;
  @ApiProperty({description: 'numberQuestions'})
  numberQuestions?: number;

}
export class CreateExamOutput extends CoreOutput {
}
export class ListExamInput {
  @ApiProperty({ description: 'page' })
  page: number;

  @ApiProperty({ description: 'pageSize' })
  pageSize: number;
}
export class ListExamOutput extends CoreOutput {
  @ApiProperty({ description: 'exams' })
  exams?: Exam[];

  @ApiProperty({ description: 'totalCount' })
  total?: number;
}

export class ExamOutput extends CoreOutput {
  @ApiProperty({ description: 'exam' })
  exam?: Exam;
}
export class ReviewExamInput {
  @ApiProperty({ description: 'examId' })
  examId: number;

  @ApiProperty({ description: 'amount' })
  amount: number;
}