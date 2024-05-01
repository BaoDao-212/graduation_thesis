import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Entity,ManyToOne,JoinColumn
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

    @ManyToOne(() => Answer, answer => answer.id)
    @JoinColumn ({name:'answer_id'})
    @ApiProperty()
    answer: Answer;

    @ManyToOne(() => Result, result => result.detailResult)
    @JoinColumn ()
    @ApiProperty()
    result: Result;
}
