import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository, In, Like } from 'typeorm';
import { createError } from '../common/utils/createError';
import {
  CreatePostInput,
  CreatePostOutput,
  DetailPostOutput,
  ListPostInput,
  ListPostOutput,
  ListPostPublicInput,
  UpdatePostInput,
  UpdatePostOutput,
} from './post.dto';
import { Post, PostStatus } from 'src/entities/post.entity';
import { Exam, ExamStatus } from 'src/entities/exam.entity';
import { CoreOutput } from '../common/output.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async findAllExam(examIds: number[]) {
    const exams = await this.examRepo.findByIds(examIds);
    if (exams.length !== examIds.length) {
      return createError(
        'Exam',
        'No exist one exam in array exam and there exists a pair of identical exams',
      );
    }
    return exams;
  }
  async createPost(
    input: CreatePostInput,
    currentUser: User,
  ): Promise<CreatePostOutput> {
    try {
      const { examIds, content, status, name } = input;
      const exams = await this.examRepo.find({
        where: {
          id: In(examIds),
        },
      });
      if (exams.length !== examIds.length) {
        return createError(
          'Exam',
          'No exist one exam in array exam and there exists a pair of identical exams',
        );
      }
      let s;
      if (status === undefined) {
        s = PostStatus.PUBLISHED;
      }
      if (status != PostStatus.PRIVATE && status != PostStatus.PUBLISHED)
        return createError('Post', 'Status must be private or public');
      s = status;
      const examName = await this.examRepo.findOne({
        where: {
          name: name,
          user: {
            id: currentUser.id,
          },
        },
      });
      if (examName)
        return createError('Post', 'You have created a post with this name');
      const post = await this.postRepo.create({
        content: content,
        exams: exams,
        user: currentUser,
        status: s,
        name,
      });
      await this.postRepo.save(post);
      return {
        ok: true,
        post,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async updatePost(
    id: number,
    input: UpdatePostInput,
    currentUser: User,
  ): Promise<UpdatePostOutput> {
    try {
      const { examIds, content, status, name } = input;
      const post = await this.postRepo.findOne({
        where: {
          id: id,
        },
        relations: {
          exams: true,
          user: true,
        },
      });
      if (!post) return createError('Post', 'Post not found');
      if (post.user.id != currentUser.id)
        return createError('Post', 'You are not the owner of this post');
      const exams = await this.examRepo.findByIds(examIds);
      if (exams.length !== examIds.length) {
        return createError(
          'Exam',
          'No exist one exam in array exam and there exists a pair of identical exams',
        );
      }
      let s;
      if (status === undefined) {
        s = PostStatus.PUBLISHED;
      }
      if (status != PostStatus.PRIVATE && status != PostStatus.PUBLISHED)
        return createError('Post', 'Status must be private or public');
      const examName = await this.examRepo.findOne({
        where: {
          name: name,
          user: {
            id: currentUser.id,
          },
        },
      });
      if (examName)
        return createError('Post', 'You have created a post with this name');
      s = status;
      post.content = content;
      post.exams = exams;
      post.status = s;
      post.name = name;
      post.updatedAt = new Date();
      await this.postRepo.save(post);
      return {
        ok: true,
        post,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async listOwnerPosts(
    currentUser: User,
    input: ListPostInput,
  ): Promise<ListPostOutput> {
    try {
      const { page, size } = input;
      const posts = await this.postRepo.find({
        relations: {
          exams: true,
          user: true,
        },
        where: {
          user: {
            id: currentUser.id,
          },
        },
        order: {
          createdAt: 'DESC',
        },
        take: size,
        skip: (page - 1) * size,
      });
      return {
        ok: true,
        posts,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async listPublicPosts(
    idUser: number,
    currentUser: User,
    input: ListPostInput,
  ): Promise<ListPostOutput> {
    try {
      const { page, size } = input;
      const user = await this.userRepo.findOne({
        where: {
          id: idUser,
        },
      });
      
      if (!user) return createError('User', 'User not found');
      const [posts,total] = await this.postRepo.findAndCount({
        relations: {
          exams: true,
          user: true,
        },
        where: {
          status: PostStatus.PUBLISHED,
          user: {
            id: idUser,
          },
        },
        order: {
          createdAt: 'DESC',
        },
        take: size,
        skip: (page - 1) * size,
      });

      return {
        ok: true,
        posts,
        user,
        total
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  // hàm tìm tất cả các bài viết có đề thi có lượt đánh giá cao nhất
  async listPostByRating(input: ListPostPublicInput): Promise<ListPostOutput> {
    try {
      const { page, size, search, sortBy } = input;
      let posts;
      let total;
      if (sortBy === 'numberUserTest') {
        [ posts,total] = await this.postRepo.findAndCount({
          relations: {
            exams: true,
            user: true,
          },
          where: {
            status: PostStatus.PUBLISHED, name: Like(`%${search}%`),
          },
          order: {
            exams: {
              numberUserTest: 'DESC',
            },
          },
          take: size,
          skip: (page - 1) * size,
        });
      } else if (sortBy === 'averageRating') {
         [ posts,total] = await this.postRepo.findAndCount({
          relations: {
            exams: true,
            user: true,
          },
          where: {
            status: PostStatus.PUBLISHED,
            name: Like(`%${search}%`),
          },
          order: {
            exams: {
              averageRating: 'DESC',
            },
          },
          take: size,
          skip: (page - 1) * size,
        });
      }
      else if(sortBy === 'numberReviews'){
         [ posts,total] = await this.postRepo.findAndCount({
          relations: {
            exams: true,
            user: true,
          },
          where: {
            status: PostStatus.PUBLISHED,
            name: Like(`%${search}%`),
          },
          order: {
            exams: {
              numberReviews: 'DESC',
            },
          },
          take: size,
          skip: (page - 1) * size,
        });  
      }
      else {
       [ posts,total] = await this.postRepo.findAndCount({
        relations: {
          exams: true,
          user: true,
        },
        where: {
          status: PostStatus.PUBLISHED,
          name: Like(`%${search}%`),
        },
        order: {
            createdAt: 'DESC',
        },
        take: size,
        skip: (page - 1) * size,
      });  
      }
      return {
        ok: true,
        posts,
        total
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async listPublicPostsAll(
    input: ListPostPublicInput,
  ): Promise<ListPostOutput> {
    try {
      const { page, size, search, sortBy } = input;

      let examIds = await this.getExamIds(search, sortBy, size * page);

      const posts = await this.getPostsByExamIds(examIds);

      const startIndex = size * (page - 1);
      const endIndex = startIndex + size;
      const resultPosts = posts.slice(startIndex, endIndex);
      return {
        ok: true,
        posts: resultPosts,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  private async getExamIds(
    search: string,
    sortBy: string,
    take: number,
  ): Promise<{ id: number }[]> {
    if (sortBy === 'numberUserTest') {
      return this.examRepo.find({
        where: {
          name: Like(`%${search}%`),
          status: ExamStatus.ACTIVE,
        },
        select: ['id'],
        order: {
          numberUserTest: 'ASC',
        },
        take,
      });
    } else if (sortBy === 'averageRating') {
      return this.examRepo.find({
        where: {
          name: Like(`%${search}%`),
          status: ExamStatus.ACTIVE,
        },
        select: ['id'],
        order: {
          averageRating: 'ASC',
        },
        take,
      });
    } else if (sortBy === 'numberReviews') {
      return this.examRepo.find({
        where: {
          name: Like(`%${search}%`),
          status: ExamStatus.ACTIVE,
        },
        select: ['id'],
        order: {
          numberReviews: 'ASC',
        },
        take,
      });
    } else {
      return this.examRepo.find({
        where: {
          name: Like(`%${search}%`),
          status: ExamStatus.ACTIVE,
        },
        select: ['id'],
        take,
      });
    }
  }

  private async getPostsByExamIds(examIds: { id: number }[]): Promise<any[]> {
    const posts = [];
    console.log(examIds);
    for (const exam of examIds) {
      const ps = await this.postRepo.find({
        relations: {
          exams: true,
          user: true,
        },
        where: {
          status: PostStatus.PUBLISHED,
          exams: {
            id: exam.id,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });
      posts.push(...ps);
    }
    return posts;
  }

  async detailsPost(id: number, currentUser: User): Promise<DetailPostOutput> {
    try {
      const post = await this.postRepo.findOne({
        relations: {
          exams: true,
          user: true,
        },
        where: {
          id: id,
        },
      });
      if (!post) return createError('Post', 'Post not found');
      if (
        post.user.id !== currentUser.id &&
        post.status != PostStatus.PUBLISHED
      )
        return createError('Post', 'Invalid access');
      return {
        ok: true,
        posts: post,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  //delete post
  async deletePost(id: number, currentUser: User): Promise<CoreOutput> {
    try {
      const post = await this.postRepo.findOne({
        where: {
          id: id,
        },
        relations: {
          user: true,
        },
      });
      if (!post) return createError('Post', 'Post not found');
      if (post.user.id != currentUser.id)
        return createError('Post', 'You are not the owner of this post');
      await this.postRepo.delete(id);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
