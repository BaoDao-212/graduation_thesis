import { Body, Controller, Get, Post, Put, ParseIntPipe, Param,Patch ,Query,Delete} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/role.decorator';
import { CurrentUser } from '../auth/user.decorator';
import { User } from 'src/entities/user.entity';
import { AnswerService } from './answer.servive';
import { CreateAnswerInput, CreateAnswerOutput } from './answer.dto';


@ApiTags('Answer')
@Controller('/api/answer')
@ApiSecurity('admin')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) { }
  @ApiOperation({
    summary: 'create answer',
  })
  @Roles(['Any'])
  @Post('create')
  @ApiOkResponse({ type: CreateAnswerOutput })
  async createAnswer(@Body() input: CreateAnswerInput, @CurrentUser() currentUser: User) {
    return this.answerService.createAnswer(input, currentUser);
  }
 
}
