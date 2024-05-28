import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/role.decorator';
import { CategoryInput, CategoryOutput } from './admin.dto';
import { CategoryService } from './admin.service';

@ApiTags('Admin')
@Controller('/admin')
@ApiSecurity('admin')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Roles(['Admin'])
  @Post('category')
  @ApiOkResponse({ type: CategoryOutput })
  async updateApiKey(@Body() input: CategoryInput) {
    return this.categoryService.createCategory(input);
  }
}
