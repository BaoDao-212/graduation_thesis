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
import { CreateExamInput, CreateExamOutput} from './exam.dto';
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

  
}
