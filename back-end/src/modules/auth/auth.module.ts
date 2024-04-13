import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './auth.guard';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';
import { AccessTokenEntity } from 'src/entities/access-token.entity';
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,AccessTokenEntity,RefreshTokenEntity])],
  providers: [
    AuthService,
    AuthResolver,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthResolver],
})
export class AuthModule {}
