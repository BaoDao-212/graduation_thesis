import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class GetInfoOutput extends CoreOutput {
  @ApiProperty({ description: 'user' })
  user?: User;
}

export class ChangePersonalInfoInput {
  @ApiProperty({ description: 'name' })
  name: string;
  @ApiProperty({ description: 'address' })
  address: string;
  @ApiProperty({ description: 'introduce' })
  introduce: string;
  @ApiProperty({ description: 'phone' })
  phone: string;
}

export class ChangePasswordInput {
  @ApiProperty({ description: 'password' })
  oldPassword: string;
  @ApiProperty({ description: 'new password' })
  newPassword: string;
  @ApiProperty({ description: 're-enter password' })
  confirmNewPassword: string;
}

export class ChangePersonalInfoOutput extends CoreOutput { }
export class ChangePasswordOutput extends CoreOutput { }
export class OpenAiKeyInput {
  @ApiProperty({ description: 'openAiKey' })
  openAiKey: string;
}
export class OpenAiKeyOutput extends CoreOutput { 
  @ApiProperty({ description: 'openAiKey' })
  assistant?: string;
}