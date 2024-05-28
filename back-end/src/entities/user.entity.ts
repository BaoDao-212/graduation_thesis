import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { compare, hash } from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  Column,
  Entity,OneToMany,Relation,OneToOne
} from 'typeorm';
import { Post } from './post.entity';
import { Apikey } from './apikey.entity';
export enum Position {
  Admin = 'Admin',
  User = 'User',
}
@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ nullable: true })
  @ApiProperty()
  address?: string;

  @Column({ nullable: true })
  @ApiProperty()
  introduce?: string;

  @Column({ nullable: true })
  @ApiProperty()
  name?: string;

  @Column({ unique: true })
  @ApiProperty()
  username: string;

  @Column({nullable: true})
  @ApiProperty()
  password?: string;

  @Column('enum', {
    enum: Position,
    default: Position.User,
  })
  @ApiProperty()
  position?: Position;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  email?: string;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  phone?: string;

  @OneToOne(() => Apikey, apikey => apikey.user)
  @ApiProperty()
  apiKey?: Apikey;



  @OneToMany(type=>Post, post =>post.user)
  @ApiProperty()
  posts?:Post[]
  // phương thức xử lí password
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;
    this.password = await hash(this.password, 12);
  }
  async checkPassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }
}
