import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  ParseIntPipe,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/role.decorator';
import { CurrentUser } from '../auth/user.decorator';
import { User } from 'src/entities/user.entity';
import { ApikeyService } from './openai.service';
import {
  GenerateAnswerInput,
  OpenAiKeyInput,
  OpenAiKeyOutput,
} from './openai.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadInput } from '../upload/dto/UploadFile.dto';

@ApiTags('Apikey')
@Controller('/api/openai')
@ApiSecurity('admin')
export class ApikeyController {
  constructor(private readonly apikeyService: ApikeyService) {}
  @Roles(['Any'])
  @Put('/update-apikey')
  @ApiOkResponse({ type: OpenAiKeyOutput })
  async updateApiKey(@CurrentUser() user: User, @Body() input: OpenAiKeyInput) {
    console.log(user);
    return this.apikeyService.updateApiKeyOpenAI(user, input);
  }
  // cho phép gửi file qua form data để tạo đề thi
  @ApiOperation({
    summary: 'generate questions',
  })
  @Roles(['Any'])
  @Post('generate/:examId')
  @UseInterceptors(FilesInterceptor('files'))
  async generateQuestions(
    @CurrentUser() user: User,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('examId') examId: number,
  ) {
    return this.apikeyService.generateQuestionsWithGemini(files, examId,user);
  }
}
