import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class CreateExamInput {
  @ApiProperty({ description: 'content' })
  content: string;

}
export class CreateExamOutput extends CoreOutput {
}