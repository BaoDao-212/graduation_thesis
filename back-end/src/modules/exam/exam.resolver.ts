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
import {CreateExamOutput, ExamInput, ExamOutput, ListExamOutput} from './exam.dto';
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
  async createExam(@Body() input: ExamInput, @CurrentUser() currentUser: User) {
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
  // cập nhật thông tin của đề thi
  @ApiOperation({
    summary: 'update exam',
  })
  @Roles(['Any'])
  @Put(':id')
  @ApiOkResponse({ type:CreateExamOutput })
  async updateExam(@Body() input: ExamInput, @Param('id', ParseIntPipe) id: number,@CurrentUser() currentUser: User) {
    return this.examService.updateExam(input, id,currentUser);
  }
  // lấy thông tin chi tiết của một đề thi
  @ApiOperation({
    summary: 'get exam detail',
  })
  @Roles(['Any'])
  @Get(':id')
  async getExamDetail(@Param('id', ParseIntPipe) id: number) {
    return this.examService.getExam(id);
  }
  // cho phép gửi file qua form data để tạo đề thi
  @ApiOperation({
    summary: 'generate questions',
  })
  @Roles(['Any'])
  @Post('generate/:id')
  async generateQuestions(@Param('id', ParseIntPipe) id: number, @Body() input: any) {
    return this.examService.generateQuestions(input.file, id);
  }
}
