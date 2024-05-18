import { ApiProperty } from '@nestjs/swagger';
import { Post, PostStatus } from 'src/entities/post.entity';
import { Question, QuestionLevel } from 'src/entities/question.entity';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class QuestionInput {
  @ApiProperty({ description: 'content' })
  content: string;

  @ApiProperty({ description: 'explanation' })
  explanation?: string;

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
export class AnswerInput {
  @ApiProperty({ description: 'content' })
  content: string;
  @ApiProperty({ description: 'is correct' })
  isCorrect: boolean;
}
export class CreateQuestioAndAnswerInput extends CoreOutput {
 @ApiProperty({ description: 'content' })
 content: string;
 @ApiProperty({ description: 'explanation' })
  explanation?: string;
  @ApiProperty({ description: 'level' }) 
  level: QuestionLevel;
  @ApiProperty({ description: 'answers' })
  answers: AnswerInput[];
}
