import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.servive';
import { UserResolver } from './user.resolver';
import { Apikey } from 'src/entities/apikey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Apikey ])],
  providers: [UserService, UserResolver],
  controllers: [UserResolver],
})
export class UserModule {}
