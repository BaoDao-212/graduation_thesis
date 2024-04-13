import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,OneToMany,JoinColumn,ManyToMany,JoinTable
} from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';
import { Post } from './post.entity';

@Entity({ name: 'exam' })
export class Exam extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column({ nullable: true })
    @ApiProperty()
    content?: string;


    @OneToMany(() => User, user => user.posts)
    @JoinColumn ({ name: 'user_id' })
    @ApiProperty()
    user: User
    
    @OneToMany(()=> Question, question => question.exam)
    // @JoinColumn({ name: 'exam_id' })
    @ApiProperty()
    questions: Question

    // @ManyToMany(()=>Post,post=>post.exams)
    // @JoinTable()
    // @ApiProperty()
    // posts:Post[]
}
