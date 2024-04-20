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


@ApiTags('Post')
@Controller('/api/question')
@ApiSecurity('admin')
export class AnswerController {
  constructor(private readonly postService: AnswerService) { }
  @ApiOperation({
    summary: 'create post',
  })
  @Roles(['Any'])
  @Post('create')
  @ApiOkResponse({ type: CreateAnswerOutput })
  async createAnswer(@Body() input: CreateAnswerInput, @CurrentUser() currentUser: User) {
    return this.postService.createAnswer(input, currentUser);
  }
 
}
