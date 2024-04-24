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
import { CreateExamInput, CreateExamOutput, ListExamOutput} from './exam.dto';
import { ExamService } from './exam.servive';


@ApiTags('Exam')
@Controller('/api/exam')
@ApiSecurity('admin')
export class ExamController {
  constructor(private readonly examService: ExamService) { }
  @ApiOperation({
    summary: 'create Exam',
  })
  @Roles(['Any'])
  @Post('create')
  @ApiOkResponse({ type: CreateExamOutput })
  async createExam(@Body() input: CreateExamInput, @CurrentUser() currentUser: User) {
    return this.examService.createExam(input, currentUser);
  }
  @ApiOperation({
    summary: 'list Exam',
  })
  @Roles(['Any'])
  @Get('list')
  @ApiOkResponse({ type:ListExamOutput })
  async listExam(@Query('page', ParseIntPipe) page = 1, @Query('pageSize', ParseIntPipe) pageSize = 10,@CurrentUser() currentUser: User) {
    return this.examService.listExams(currentUser,{page, pageSize});
  }
  @ApiOperation({
    summary: 'list exam name',
  })
  @Roles(['Any'])
  @Get('list_name')
  @ApiOkResponse({ type:ListExamOutput })
  async listExamName(@CurrentUser() currentUser: User) {
    console.log(currentUser.id);
    return this.examService.listExamNames(currentUser);
  }
}
