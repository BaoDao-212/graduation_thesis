import { ApiProperty } from '@nestjs/swagger';
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