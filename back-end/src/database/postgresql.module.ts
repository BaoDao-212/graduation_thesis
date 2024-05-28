import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from 'src/entities/answer.entity';
import { Apikey } from 'src/entities/apikey.entity';
import { Category } from 'src/entities/category.entity';
import { DetailResult } from 'src/entities/detail-result.entity';
import { Exam } from 'src/entities/exam.entity';
import { Post } from 'src/entities/post.entity';
import { Question } from 'src/entities/question.entity';
import { Result } from 'src/entities/result.entity';
import { User } from 'src/entities/user.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.production`, '.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',//
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'finalproject',
      entities: [
        User,
        Post,
        Exam,
        Question,
        Answer,
        Result,
        DetailResult,
        Apikey,
        Category,
      ],
      synchronize: true,
      ...(process.env.NODE_ENV === 'production'
        ? {
            ssl: true,
            extra: {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            },
          }
        : {}),
    }),
  ],
})
export class DatabaseModule {}
