import { Body, Controller, Get, Post, Put, ParseIntPipe, Param,Delete} from '@nestjs/common';
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
import { AnswerInput, CreateAnswerOutput } from './answer.dto';


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
  async createAnswer(@Body() input: AnswerInput, @CurrentUser() currentUser: User) {
    return this.answerService.createAnswer(input, currentUser);
  }
  // danh sách câu trả lời khi biết id của câu hỏi
  @ApiOperation({
    summary: 'get list answer by questionId',
  })
  @Roles(['Any'])
  @Get('list/:id')
  async getAnswerByQuestionId(@Param('id', ParseIntPipe) id: number,@CurrentUser() currentUser: User) {
    return this.answerService.getAnswerByQuestionId(id,currentUser);
  }
  // cập nhật thông tin của một câu trả lời
  @ApiOperation({summary: 'update answer'})
  @Roles(['Any'])
  @Put(':id')
  async updateAnswer(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: User,@Body() input: AnswerInput) {
    return this.answerService.updateAnswer(input,currentUser,id );
  }
  // xóa một câu trả lời
  @ApiOperation({summary: 'delete answer'})
  @Roles(['Any'])
  @Delete(':id')
  async deleteAnswer(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: User) {
    return this.answerService.deleteAnswer(id,currentUser);
  }
}
