import { ApiProperty } from '@nestjs/swagger';
import { Post, PostStatus } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class CreateQuestionInput {
  @ApiProperty({ description: 'content' })
  content: string;

  @ApiProperty({ description: 'explaination' })
  explaination?: string;

  @ApiProperty({ description: 'exam id' })
  examId: number;
}
export class CreateQuestionOutput extends CoreOutput {

}