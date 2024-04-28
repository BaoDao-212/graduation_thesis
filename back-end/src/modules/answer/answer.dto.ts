import { ApiProperty } from '@nestjs/swagger';
import { Answer } from 'src/entities/answer.entity';
import { Post, PostStatus } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class AnswerInput {
  @ApiProperty({ description: 'answer' })
  answer: string;

  @ApiProperty({ description: 'isCorrect' })
  isCorrect: boolean;

  @ApiProperty({ description: 'question id' })
  questionId: number;
}
export class CreateAnswerOutput extends CoreOutput {
}
export class AnswerOutPut extends CoreOutput{
  @ApiProperty({ description: 'answer' })
  answer?: Answer;
}
export class AnswerListOutput extends CoreOutput {
  @ApiProperty({ description: 'answers' })
  answers?: Answer[];
}