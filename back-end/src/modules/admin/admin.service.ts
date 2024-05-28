import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

import { Category } from 'src/entities/category.entity';
import { createError } from '../common/utils/createError';
import { CategoryInput, CategoryOutput } from '../admin/admin.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}
  async createCategory(
    input: CategoryInput,
  ): Promise<CategoryOutput> {
    try {
      const { name } = input;
      const category = await this.categoryRepo.findOne({
        where: {
            name: name,
        },
      });
        if (category) {
            return createError('Category', 'Category already exists');
        }
        const newCategory = await this.categoryRepo.create({
            name,
        });
        await this.categoryRepo.save(newCategory);
        return {
            ok: true,
        };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
