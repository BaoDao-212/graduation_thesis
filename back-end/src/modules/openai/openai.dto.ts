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
export class GenerateAnswerInput {
  @ApiProperty({ description: 'file' })
  file?: any;
  @ApiProperty({ description: 'idea' })
  idea?: string;
}
export class GenerateQuestionsOutput extends CoreOutput {
  @ApiProperty({ description: 'questions' })
  questions?: any;
}
export const prompt0=" From the contents of the file above,"
export const prompt1= ` Create a set of about 10 questions with answers in json format in English and add it to the file. let me download it. The questions will range from easy(0), medium(1), difficult(2) and very difficult(3). Difficult and very difficult level questions require more in-depth knowledge
The exam content is to test understanding and application of`;
export const prompt2 = `
With output of the questions in json format:
[
  {
      "content": "Which Linux command is used to display a list of PCI devices recognized by the kernel?",
      "answers": [
          { "content": "lsusb", "isCorrect": false },
          { "content": "lspci", "isCorrect": true },
          { "content": "uname -a", "isCorrect": false }
        ],
      "level": 1,
        "explanation": "lspci: A command-line tool in Linux designed to display detailed information about PCI (Peripheral Component Interconnect) devices recognized by the kernel, including ID, name, manufacturer, and various other parameters."
      }
    ]
    Note: The question must have at least 4-5 options, and there should be explanations for the correct answers.
`;