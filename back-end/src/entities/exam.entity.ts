import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,ManyToOne,JoinColumn,OneToMany,ManyToMany,JoinTable
} from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';

export enum ExamLevel{
  EASY = 0,
  NORMAL = 1,
  HARD = 2,
  VERY_HARD = 3,
}
export enum ExamStatus{
  ACTIVE = 0,
  INACTIVE = 1,
  DELETED = 2,
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

    @Column({ default: 45 })
    @ApiProperty()
    time:number;

    @Column({ nullable: true,default : ExamLevel.NORMAL })
    @ApiProperty()
    level?: ExamLevel;

    @Column({ nullable: true,default : ExamStatus.INACTIVE })
    @ApiProperty()
    status?: ExamStatus;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn ({name:'user_id'})
    @ApiProperty()
    user: User
    
    @ApiProperty()
    @Column({ default: 40 })
    numberQuestions?: number;
    
    @OneToMany(()=> Question, question => question.exam)
    @ApiProperty()
    questions: Question[]
    
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
    
    @ApiProperty()
    @Column({ default: 0 })
    numberUserTest?: number;
}
