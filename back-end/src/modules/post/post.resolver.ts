import { Body, Controller, Get, Post, Put, ParseIntPipe, Param,Patch ,Query,Delete} from '@nestjs/common';
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
import { CreatePostInput, CreatePostOutput, ListPostInput,  ListPostOutput, UpdatePostInput, UpdatePostOutput, UpdateReviewPostInput, UpdateReviewPostOutput } from './post.dto';


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
    summary: 'get post',
  })
  @Roles(['Any'])
  @Get('list')
  @ApiOkResponse({ type: ListPostOutput })
  async getPost(@Query('pageSize') pageSize: number = 10,@Query('page') page: number = 1, @CurrentUser() currentUser: User ) {
    return this.postService.listOwnerPosts(currentUser, { size:pageSize, page });
  }
  @ApiOperation({
    summary: 'get list public post',
  })
  @Roles(['Any'])
  @Get('list/:id')
  @ApiOkResponse({ type: ListPostOutput })
  async listPublicPost(@Param('id', ParseIntPipe) id: number, @Query('pageSize') pageSize: number = 10,@Query('page') page: number = 1, @CurrentUser() currentUser: User ) {
    return this.postService.listPublicPosts(id,currentUser,{ size:pageSize, page });
  }
  @ApiOperation({
    summary: 'get list public post all',
  })
  @Roles(['Any'])
  @Get('list-all')
  @ApiOkResponse({ type: ListPostOutput })
  async listPublicPostsAll( @Query('pageSize') pageSize: number = 10,@Query('page') page: number = 1,@Query('search') search:string='',@Query('sortBy') sortBy: string='') {
    return this.postService.listPostByRating( { size:pageSize, page ,search,sortBy});
  }
  @ApiOperation({
    summary: 'details post',
  })
  @Roles(['Any'])
  @Get('detail/:id')
  @ApiOkResponse({ type: ListPostOutput })
  async detailsPost(@Param('id', ParseIntPipe) id: number,@CurrentUser() currentUser: User ) {
    return this.postService.detailsPost( id,currentUser);
  }
  //delete post
  @ApiOperation({
    summary: 'delete post',
  })
  @Roles(['Any'])
  @Delete('delete/:id')
  @ApiOkResponse({ type: ListPostOutput })
  async deletePost(@Param('id', ParseIntPipe) id: number,@CurrentUser() currentUser: User ) {
    return this.postService.deletePost( id,currentUser);
  }
}
