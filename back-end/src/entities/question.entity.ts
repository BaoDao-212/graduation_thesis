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

@Entity({ name: 'question' })
export class Question extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;
    
    @Column({ nullable: true })
    @ApiProperty()
    content?: string;


    @OneToMany(() => Answer,answer=>answer.question )
    @ApiProperty()
    answers?: Answer[];

    @ManyToOne(()=>Exam ,exam=>exam.questions)
    @JoinColumn ({ name: 'user_id' })
    @ApiProperty()
    exam:Exam
    
}
