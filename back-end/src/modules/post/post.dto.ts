import { ApiProperty } from '@nestjs/swagger';
import { Post, PostStatus } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class CreatePostInput {
  @ApiProperty({ description: 'content' })
  content: string;

  @ApiProperty({ description: 'status' })
  status?: PostStatus;

  @ApiProperty({ description: 'array of exam id' })
  examIds: number[];
}

export class UpdatePostInput {
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
