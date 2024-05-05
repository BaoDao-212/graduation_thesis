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
import {  ResultService } from './result.servive';
import { DetailResultInput, ResultInput} from './result.dto';


@ApiTags('Result')
@Controller('/api/result')
@ApiSecurity('admin')
export class ResultController {
  constructor(private readonly resultService: ResultService) { }
  @ApiOperation({
    summary: 'create result',
  })
  @Roles(['Any'])
  @Post('create')
  async createResult(@Body() input: ResultInput, @CurrentUser() currentUser: User) {
    return this.resultService.createResult(input, currentUser);
  }
  @ApiOperation({
    summary: 'get result detail',
  })
  @Roles(['Any'])
  @Get(':id')
  async getResult(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: User) {
    return this.resultService.getResultDetail(id,currentUser);
  }
  // nộp kết quả của một câu hỏi
  @ApiOperation({
    summary: 'submit answer',
  })
  @Roles(['Any'])
  @Post('submit')
  async submitAnswer(@Body() input: DetailResultInput, @CurrentUser() currentUser: User) {
    return this.resultService.submitAnswer(input, currentUser);
  }
  @ApiOperation({
    summary: 'finish result',
  })
  @Roles(['Any'])
  @Get('finish/:id')
  async finishResult(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: User) {
    return this.resultService.calculateScore(id,currentUser);
  }
}
