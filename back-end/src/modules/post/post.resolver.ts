import { Body, Controller, Get, Post, Put, ParseIntPipe, Param,Patch } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PostService } from './post.servive';
import { Roles } from '../auth/role.decorator';
import { CurrentUser } from '../auth/user.decorator';
import { User } from 'src/entities/user.entity';
import { CreatePostInput, CreatePostOutput, UpdatePostInput, UpdatePostOutput, UpdateReviewPostInput, UpdateReviewPostOutput } from './post.dto';


@ApiTags('Post')
@Controller('/api/post')
@ApiSecurity('admin')
export class PostController {
  constructor(private readonly postService: PostService) { }
  @ApiOperation({
    summary: 'create post',
  })
  @Roles(['Any'])
  @Post('create')
  @ApiOkResponse({ type: CreatePostOutput })
  async createPost(@Body() input: CreatePostInput, @CurrentUser() currentUser: User) {
    return this.postService.createPost(input, currentUser);
  }

  @ApiOperation({
    summary: 'update post',
  })
  @Roles(['Any'])
  @Put('update/:id')
  @ApiOkResponse({ type: UpdatePostOutput })
  async updatePost(@Param('id', ParseIntPipe) id: number, @Body() input: UpdatePostInput, @CurrentUser() currentUser: User) {
    return this.postService.updatePost(id, input, currentUser);
  }
  @ApiOperation({
    summary: 'update review post',
  })
  @Roles(['Any'])
  @Patch('update/review/:id')
  @ApiOkResponse({ type: UpdateReviewPostOutput })
  async updateReviewPost(@Param('id', ParseIntPipe) id: number, @Body() input: UpdateReviewPostInput, @CurrentUser() currentUser: User) {
    return this.postService.updateReviewPost(id, input, currentUser);
  }
}
