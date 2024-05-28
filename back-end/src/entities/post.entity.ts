import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,ManyToOne,JoinColumn,ManyToMany,JoinTable
} from 'typeorm';
import { User } from './user.entity';
import { Exam } from './exam.entity';
import { Category } from './category.entity';
export enum PostStatus {
    PRIVATE = 'PRIVATE',
    PUBLISHED = 'PUBLISHED',
}
@Entity({ name: 'post' })
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    name?: string;

    @Column({ nullable: true })
    @ApiProperty()
    content?: string;
    @ManyToOne(() => User, user => user.posts)
    @JoinColumn ({ name: 'user_id' })
    user: User

    @ApiProperty()
    @Column({default:PostStatus.PUBLISHED})
    status:PostStatus


    @ManyToMany(()=>Exam)
    @JoinTable()
    @ApiProperty()
    exams?:Exam[]
    
    // thêm cột liên kết với category
    @ManyToMany(()=>Category)
    @JoinTable()
    @ApiProperty()
    categories?:Category[]
}
