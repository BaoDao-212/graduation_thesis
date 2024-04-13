import { BaseEntity } from "./base.entity";
import { ApiProperty } from '@nestjs/swagger';
import {
    PrimaryGeneratedColumn,
    Column,
    Entity,ManyToOne,JoinColumn
  } from 'typeorm';
import { Question } from "./question.entity";
@Entity({name:'answer'})
export class Answer extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;
  
    @Column()
    @ApiProperty()
    answer?: string;
    
    @Column({default:false})
    @ApiProperty()
    isCorrect?: boolean;
    
    @ManyToOne(() => Question, question => question.answers)
    @JoinColumn ({ name: 'question_id' })
    @ApiProperty()
    question: Question
  
}