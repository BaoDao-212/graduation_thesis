import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,OneToMany,JoinColumn
} from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';

export enum ExamLevel{
  EASY = 0,
  NORMAL = 1,
  HARD = 2,
  VERY_HARD = 3,
}
@Entity({ name: 'exam' })
export class Exam extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column({ nullable: true })
    @ApiProperty()
    name?: string;

    @Column({ nullable: true })
    @ApiProperty()
    content?: string;
    
    @Column({ nullable: true,default : ExamLevel.NORMAL })
    @ApiProperty()
    level?: ExamLevel;

    @OneToMany(() => User, user => user.posts)
    @JoinColumn ({ name: 'user_id' })
    @ApiProperty()
    user: User
    
    @OneToMany(()=> Question, question => question.exam)
    @ApiProperty()
    questions: Question
    
}
