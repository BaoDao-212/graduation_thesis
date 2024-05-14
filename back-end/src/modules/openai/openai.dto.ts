import { ApiProperty } from '@nestjs/swagger';
import { Answer } from 'src/entities/answer.entity';
import { Post, PostStatus } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class OpenAiKeyInput {
  @ApiProperty({ description: 'apikey' })
  openAiKey:string;
}
export class OpenAiKeyOutput extends CoreOutput { }

export class AnswerOutPut extends CoreOutput{
  @ApiProperty({ description: 'answer' })
  answer?: Answer;
}
export class AnswerListOutput extends CoreOutput {
  @ApiProperty({ description: 'answers' })
  answers?: Answer[];
}