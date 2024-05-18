import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,OneToMany,ManyToOne,JoinColumn
} from 'typeorm';
import { User } from './user.entity';
import { Answer } from './answer.entity';
import { Exam } from './exam.entity';

export enum QuestionLevel{
  EASY = 0,
  NORMAL = 1,
  HARD = 2,
  VERY_HARD = 3,
}
@Entity({ name: 'question' })
export class Question extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;
    
    @Column({ nullable: true })
    @ApiProperty()
    content?: string;
    
    @Column({ nullable: true })
    @ApiProperty()
    explanation?: string;
    
    @Column({ nullable: true ,default:QuestionLevel.NORMAL})
    @ApiProperty()
    level?: QuestionLevel;

    @OneToMany(() => Answer,answer=>answer.question )
    @ApiProperty()
    answers?: Answer[];

    @ManyToOne(()=>Exam ,exam=>exam.questions)
    @JoinColumn ({ name: 'exam_id' })
    @ApiProperty()
    exam:Exam
}
