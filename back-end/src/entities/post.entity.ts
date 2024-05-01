import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,ManyToOne,JoinColumn,ManyToMany,JoinTable
} from 'typeorm';
import { User } from './user.entity';
import { Exam } from './exam.entity';
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

    @ApiProperty()
    @Column({ default: 0 })
    numberReviews?: number;

    @ApiProperty()
    @Column({ default: 0 })
    averageRating?: number;

    @ManyToMany(()=>User)
    @JoinTable()
    @ApiProperty()
    usersReviewed?:User[]

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
}
