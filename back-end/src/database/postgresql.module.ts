import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.production`, '.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'finalproject',
      entities: [User],
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
