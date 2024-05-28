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
import { QuestionInput, CreateQuestionOutput, CreateQuestioAndAnswerInput } from './question.dto';
import { QuestionService } from './question.servive';


@ApiTags('Question')
@Controller('/api/question')
@ApiSecurity('admin')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }
  @ApiOperation({
    summary: 'create question',
  })
  @Roles(['Any'])
  @Post('create')
  @ApiOkResponse({ type: CreateQuestionOutput })
  async createQuestion(@Body() input: QuestionInput, @CurrentUser() currentUser: User) {
    return this.questionService.createQuestion(input, currentUser);
  }
 // danh sách câu hỏi khi biết id của exam
  @ApiOperation({
    summary: 'get list question by examId',
  })
  @Roles(['Any'])
  @Get('list/:id')
  async getQuestionByExamId(@Param('id', ParseIntPipe) id: number,@CurrentUser() currentUser: User) {
    return this.questionService.getQuestionByExamId(id,currentUser);
  }
  // lấy  thông tin của một câu hỏi
  @ApiOperation({
    summary: 'get question by id',
  })
  @Roles(['Any'])
  @Get(':id')
  async getQuestionById(@Param('id', ParseIntPipe) id: number,@CurrentUser() currentUser: User) {
    return this.questionService.getQuestionById(id,currentUser);
  }
  // cập nhất thông tin của một câu hỏi
  @ApiOperation({summary: 'update question'})
  @Roles(['Any'])
  @Put(':id')
  async updateQuestion(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: User,@Body() input: QuestionInput) {
    return this.questionService.updateQuestion(input,currentUser,id );
  }
  // thêm bộ câu hỏi và mảng câu trả lời đi kèm
  @ApiOperation({summary: 'add answer to question'})
  @Roles(['Any'])
  @Post('question-answer/:id')
  async addAnswerToQuestion(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: User,@Body() input: CreateQuestioAndAnswerInput) {
    return this.questionService.addQuestionAndAnswer(input,currentUser,id );
  }
  // xóa câu hỏi
  @ApiOperation({summary: 'delete question'})
  @Roles(['Any'])
  @Delete(':id')
  async deleteQuestion(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: User) {
    return this.questionService.deleteQuestion(id,currentUser);
  }
}
