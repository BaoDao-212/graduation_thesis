import { Body, Controller, Get, Post, Put, ParseIntPipe, Param,Delete, UploadedFile, UseInterceptors} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/role.decorator';
import { CurrentUser } from '../auth/user.decorator';
import { User } from 'src/entities/user.entity';
import {ApikeyService } from './openai.servive';
import { OpenAiKeyInput, OpenAiKeyOutput } from './openai.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('Apikey')
@Controller('/api/openai')
@ApiSecurity('admin')
export class ApikeyController {
  constructor(private readonly apikeyService: ApikeyService) { }
  @Roles(['Any'])
  @Put('/update-apikey')
  @ApiOkResponse({ type: OpenAiKeyOutput })
  async updateApiKey(@CurrentUser() user: User, @Body() input: OpenAiKeyInput) {
    return this.apikeyService.updateApiKeyOpenAI(user, input);
  }
   // cho phép gửi file qua form data để tạo đề thi
   @ApiOperation({
    summary: 'generate questions',
  })
  @Roles(['Any'])
  @UseInterceptors(FileInterceptor('file'))
  @Post('generate/:id')
  async generateQuestions(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
    return this.apikeyService.generateQuestions(file, id);
  }
}
