import { ApiProperty } from '@nestjs/swagger';
import { Exam } from 'src/entities/exam.entity';
import { Result } from 'src/entities/result.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class ResultInput {
 @ApiProperty({description: 'examId'})
  examId: number;

  @ApiProperty({description: 'user id'})
  userId: number;
}
export class ResultOutput extends CoreOutput {
  @ApiProperty()
  result?: Result;
}
export class ResultSubmitedOutput extends CoreOutput {
  @ApiProperty()
  result?: Result;
  @ApiProperty()
  exam?: Exam;
}
export class DetailResultInput {
  @ApiProperty({description: 'question id'})
  questionId: number;

  @ApiProperty({description: 'answer id'})
  answerId: number[];

  @ApiProperty({description: 'result id'})
  resultId: number;
}
export class DetailResultOutput extends CoreOutput {
}
