import { ApiProperty } from '@nestjs/swagger';
import { ExamLevel } from 'src/entities/exam.entity';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class CreateExamInput {
  @ApiProperty({ description: 'content' })
  content: string;
  
  @ApiProperty({ description: 'name' })
  name:string;

  @ApiProperty({ description: 'level' })
  level: ExamLevel;

}
export class CreateExamOutput extends CoreOutput {
}