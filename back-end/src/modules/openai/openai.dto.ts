import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/modules/common/output.dto';

export class OpenAiKeyInput {
  @ApiProperty({ description: 'openAiKey' })
  openAiKey: string;
}
export class OpenAiKeyOutput extends CoreOutput { 
  @ApiProperty({ description: 'openAiKey' })
  assistant?: string;
}
export class GenerateQuestionsInput {
  @ApiProperty({ description: 'file' })
 file: Express.Multer.File;
}