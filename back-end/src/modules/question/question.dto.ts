import { ApiProperty } from '@nestjs/swagger';
import { Post, PostStatus } from 'src/entities/post.entity';
import { Question, QuestionLevel } from 'src/entities/question.entity';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class QuestionInput {
  @ApiProperty({ description: 'content' })
  content: string;

  @ApiProperty({ description: 'explaination' })
  explaination?: string;

  @ApiProperty({ description: 'exam id' })
  examId: number;

  @ApiProperty({ description: 'level of question' })
  level: QuestionLevel;
};

export class CreateQuestionOutput extends CoreOutput {
}
export class ListQuestionOutput extends CoreOutput {
  @ApiProperty({ description: 'questions' })
  questions?: Question[];
}
export class QuestionOutput extends CoreOutput {
  @ApiProperty({ description: 'question' })
  question?: Question;
}