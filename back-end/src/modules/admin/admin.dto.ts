import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/modules/common/output.dto';

export class CategoryInput {
  @ApiProperty({ description: 'name' })
  name: string;
}
export class CategoryOutput extends CoreOutput {}

