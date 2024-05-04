import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,ManyToOne,JoinColumn,OneToMany,ManyToMany,JoinTable
} from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';
import { Exam } from './exam.entity';
import { DetailResult } from './detail-result.entity';


@Entity({ name: 'result' })
export class Result extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @ManyToMany(() => Exam)
    @JoinTable()
    @ApiProperty()
    exam?: Exam;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn ({name:'user_id'})
    @ApiProperty()
    user: User

    @Column({ nullable: true })
    @ApiProperty()
    time?: number;

    @Column({ nullable: true,default:-1 })
    @ApiProperty()
    score?: number;
    
    @OneToMany(() => DetailResult,detailResult=>detailResult.result )
    @ApiProperty()
    detailResult?: DetailResult[];
}
