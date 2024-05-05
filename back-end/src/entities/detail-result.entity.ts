import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,Column,
  Entity,ManyToOne,JoinColumn,ManyToMany,JoinTable
} from 'typeorm';
import { Question } from './question.entity';
import { Answer } from './answer.entity';
import { Result } from './result.entity';


@Entity({ name: 'detail-result' })
export class DetailResult {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @ManyToOne(() => Question, question => question.id)
    @JoinColumn ({name:'question_id'})
    @ApiProperty()
    question: Question;

    @ManyToMany(() => Answer, answer => answer.id)
    @JoinTable()
    answer: Answer[];

    @ManyToOne(() => Result, result => result.detailResult)
    @JoinColumn ()
    @ApiProperty()
    result: Result;

    @ApiProperty({default:0})
    @Column({default:0})
    score: number;
}
