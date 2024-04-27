import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { CreatePostInput, CreatePostOutput,DetailPostOutput,ListPostInput, ListPostOutput, UpdatePostInput, UpdatePostOutput, UpdateReviewPostInput } from './post.dto';
import { Post, PostStatus } from 'src/entities/post.entity';
import { Exam } from 'src/entities/exam.entity';
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
        return createError('Exam', 'No exist one exam in array exam and there exists a pair of identical exams');
    }
    return exams;
}
async createPost(
  input: CreatePostInput,
  currentUser: User,
): Promise<CreatePostOutput> {
  try {
    const {examIds, content,status } = input;
    const exams = await this.examRepo.findByIds(examIds);
    if (exams.length !== examIds.length) {
        return createError('Exam', 'No exist one exam in array exam and there exists a pair of identical exams');
    }
    let s;
    if(status === undefined) {
      s = PostStatus.PUBLISHED;
    }
    if(status != PostStatus.PRIVATE && status != PostStatus.PUBLISHED) 
      return createError('Post', 'Status must be private or public');
    s=status;
    const post = await this.postRepo.create({
      content: content,
      exams: exams,
      user: currentUser,
      status:s,
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
  id : number,
  input: UpdatePostInput,
  currentUser: User,
): Promise<UpdatePostOutput> {
  try {
    const {examIds, content,status } = input;
    const post = await this.postRepo.findOne({
      where:{
        id:id,
      },
      relations:{
        exams:true,
        user:true,
      }
    }); 
    if (!post) return createError('Post', 'Post not found');
    if(post.user.id!=currentUser.id) return createError('Post', 'You are not the owner of this post');
    const exams = await this.examRepo.findByIds(examIds);
    if (exams.length !== examIds.length) {
        return createError('Exam', 'No exist one exam in array exam and there exists a pair of identical exams');
    }
    let s;
    if(status === undefined) {
      s = PostStatus.PUBLISHED;
    }
    if(status != PostStatus.PRIVATE && status != PostStatus.PUBLISHED) 
      return createError('Post', 'Status must be private or public');
    s=status;
    post.content = content;
    post.exams = exams;
    post.status = s;
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
async updateReviewPost(
  id : number,
  input: UpdateReviewPostInput,
  currentUser: User,
): Promise<CoreOutput> {
  try {
    const {review} = input;
    const post = await this.postRepo.findOne({
      where:{
        id:id,
      },
      relations:{
        usersReviewed:true,
        user:true,

      }
    });
    if(post.status==PostStatus.PRIVATE) return createError('Post', 'Invalid access' );
    if (!post) return createError('Post', 'Post not found');
    if(post!.user.id==currentUser.id) return createError('Post', 'You are the owner of this post')
    if(post.usersReviewed.find(user=>user.id==currentUser.id)) return createError('Post', 'You have reviewed this post');
    post.numberReviews+=1;
    post.averageRating+= review;
    post.usersReviewed.push(currentUser);
    await this.postRepo.save(post);
    return {
      ok: true,
    };
  } catch (error) {
    return createError('Server', 'Lỗi server, thử lại sau');
  }
}
async listOwnerPosts(currentUser:User, input:ListPostInput):Promise<ListPostOutput>{
  try {
    const {page,size} =input;
    const posts = await this.postRepo.find({
      relations:{
        exams:true,
        user:true,
      },
      where:{
        user:{
          id:currentUser.id,
        }
      },
      order:{
        createdAt:'DESC',
      },
      take:size,
      skip:(page-1)*size,
    });
    return {
      ok: true,
      posts,
    };
  } catch (error) {
    return createError('Server', 'Lỗi server, thử lại sau');
  }
}
async listPublicPosts(idUser:number,currentUser:User, input:ListPostInput):Promise<ListPostOutput>{
  try {
    const {page,size} =input;
    const user= await this.userRepo.findOne({
      where:{
        id:idUser,
      },
    });
    if(!user) return createError('User', 'User not found');
    const posts = await this.postRepo.find({
      relations:{
        exams:true,
        user:true,
      },
      where:{
        status:PostStatus.PUBLISHED,
        user:{
          id:idUser,
        }
      },
      order:{
        createdAt:'DESC',
      },
      take:size,
      skip:(page-1)*size,
    });
    return {
      ok: true,
      posts,
    };
  } catch (error) {
    return createError('Server', 'Lỗi server, thử lại sau');
  }
}

async listPublicPostsAll(input:ListPostInput):Promise<ListPostOutput>{
  try {
    const {page,size} =input;
    const posts = await this.postRepo.find({
      relations:{
        exams:true,
        user:true,
      },
      where:{
        status:PostStatus.PUBLISHED,
      },
      order:{
        createdAt:'DESC',
      },
      take:size,
      skip:(page-1)*size,
    });
    return {
      ok: true,
      posts,
    };
  } catch (error) {
    return createError('Server', 'Lỗi server, thử lại sau');
  }
}
async detailsPost(id:number,currentUser:User):Promise<DetailPostOutput>{
    try {
      const post = await this.postRepo.findOne({
        relations:{
          exams:true,
          user:true,
        },
        where:{
          id:id,
          }
      });
      if(!post) return createError('Post', 'Post not found');
      if(post.user.id!==currentUser.id && post.status!=PostStatus.PUBLISHED )
        return createError('Post', 'Invalid access' )
      return {
        ok:true,
        posts:post,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  //delete post
  async deletePost(id:number,currentUser:User):Promise<CoreOutput>{
    try {
      const post = await this.postRepo.findOne({
        where:{
          id:id,
        },
        relations:{
          user:true,
        }
      });
      if(!post) return createError('Post', 'Post not found');
      if(post.user.id!=currentUser.id) return createError('Post', 'You are not the owner of this post');
      await this.postRepo.delete(id);
      return {
        ok:true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
