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
import { CreateQuestionInput, CreateQuestionOutput } from './question.dto';
import { QuestionService } from './question.servive';


@ApiTags('Post')
@Controller('/api/question')
@ApiSecurity('admin')
export class QuestionController {
  constructor(private readonly postService: QuestionService) { }
  @ApiOperation({
    summary: 'create post',
  })
  @Roles(['Any'])
  @Post('create')
  @ApiOkResponse({ type: CreateQuestionOutput })
  async createQuestion(@Body() input: CreateQuestionInput, @CurrentUser() currentUser: User) {
    return this.postService.createQuestion(input, currentUser);
  }
 
}
