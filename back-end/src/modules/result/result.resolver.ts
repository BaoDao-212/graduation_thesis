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
import { ResultInput, ResultOutput } from './result.dto';


@ApiTags('Result')
@Controller('/api/result')
@ApiSecurity('admin')
export class ResultController {
  constructor(private readonly resultService: ResultService) { }
  @ApiOperation({
    summary: 'create answer',
  })
  @Roles(['Any'])
  @Post('create')
  @ApiOkResponse({ type: ResultOutput })
  async createResult(@Body() input: ResultInput, @CurrentUser() currentUser: User) {
    return this.resultService.createResult(input, currentUser);
  }
}
