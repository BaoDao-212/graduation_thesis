import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity({ name: 'category' })
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ nullable: true })
  @ApiProperty()
  name?: string;
}
