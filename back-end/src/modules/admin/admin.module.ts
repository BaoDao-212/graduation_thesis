import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './admin.resolver';
import { Category } from 'src/entities/category.entity';
import { CategoryService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category]),
 ],
  providers: [CategoryService,CategoryController],
  controllers: [CategoryController],
})
export class AdminModule {}
