import { ApiProperty } from '@nestjs/swagger';
import { Post, PostStatus } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class CreateAnswerInput {
  @ApiProperty({ description: 'content' })
  content: string;

  @ApiProperty({ description: 'isCorrect' })
  isCorrect: boolean;



  @ApiProperty({ description: 'question id' })
  questionId: number;
}
export class CreateAnswerOutput extends CoreOutput {

}