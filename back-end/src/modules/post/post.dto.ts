import { ApiProperty } from '@nestjs/swagger';
import { Post, PostStatus } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class CreatePostInput {
  @ApiProperty({ description: 'name' })
  name: string;

  @ApiProperty({ description: 'content' })
  content: string;

  @ApiProperty({ description: 'status' })
  status?: PostStatus;

  @ApiProperty({ description: 'array of exam id' })
  examIds: number[];
}

export class UpdatePostInput {
  @ApiProperty({ description: 'name' })
  name: string;

  @ApiProperty({ description: 'content' })
  content: string;

  @ApiProperty({ description: 'array of exam id' })
  examIds: number[];

  @ApiProperty({ description: 'status' })
  status?: PostStatus;
}
export class UpdateReviewPostInput {
  @ApiProperty({ description: 'like' })
  review: number;
}

export class CreatePostOutput extends CoreOutput {
  @ApiProperty({ description: 'post info' })
  post?: Post;
}
export class UpdatePostOutput extends CoreOutput {
  @ApiProperty({ description: 'post info' })
  post?: Post;
}
export class UpdateReviewPostOutput extends CoreOutput {
}
export class ListPostInput{
  @ApiProperty({ description: 'page' })
  page: number;

  @ApiProperty({ description: 'size' })
  size: number;  

}
export class ListPostPublicInput{
  @ApiProperty({ description: 'page' })
  page: number;

  @ApiProperty({ description: 'size' })
  size: number;  
  @ApiProperty({ description: 'sortBy' })
  sortBy?: string;
  @ApiProperty({ description: 'search' })
  search?: string;
}


export class ListPostOutput extends CoreOutput {
  @ApiProperty({ description: 'list post' })
  posts?: Post[];
  @ApiProperty({ description: 'total post' })
  total?: number;
  @ApiProperty({ description: 'user' })
  user?: User;
}
// get details a post
export class DetailPostOutput extends CoreOutput {
  @ApiProperty({ description: 'details post' })
  posts?: Post;
}