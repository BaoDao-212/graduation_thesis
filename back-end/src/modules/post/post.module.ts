import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { PostService } from './post.servive';
import { PostController } from './post.resolver';
import { Exam } from 'src/entities/exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Exam])],
  providers: [PostService, PostController],
  controllers: [PostController],
})
export class PostModule {}
