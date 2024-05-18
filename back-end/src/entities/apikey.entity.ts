import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
export enum PostStatus {
  PRIVATE = 'PRIVATE',
  PUBLISHED = 'PUBLISHED',
}
@Entity({ name: 'apikey' })
export class Apikey extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ nullable: true })
  @ApiProperty()
  apikey?: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;
}
