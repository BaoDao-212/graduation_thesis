import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import {
  ChangePersonalInfoInput,
  ChangePasswordInput,
  ChangePersonalInfoOutput,
  ChangePasswordOutput,
  GetInfoOutput,
  OpenAiKeyInput,
  OpenAiKeyOutput,
} from './user.dto';
import { Apikey } from 'src/entities/apikey.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Apikey) private readonly apiKeyRepo: Repository<Apikey>,
  ) {}

  async getInfo(input: User): Promise<GetInfoOutput> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id: input.id,
        },
      });
      if (!user) return createError('Input', 'Người dùng không hợp lệ');
      return {
        ok: true,
        user: input,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async changePersonalInfo(
    currentUser: User,
    input: ChangePersonalInfoInput,
  ): Promise<ChangePersonalInfoOutput> {
    try {
      const { address, introduce, name, phone } = input;
      const user = await this.userRepo.findOne({
        where: { id: currentUser.id },
        select: ['id', 'name', 'phone', 'address', 'introduce'],
      });
      if (!user) createError('Input', 'User not found');
      if (name && name != user.name) user.name = name;
      if (phone && phone != user.phone) user.phone = phone;
      if (address && address != user.address) user.address = address;
      if (introduce && introduce != user.introduce) user.introduce = introduce;
      await this.userRepo.save(user);
      return {
        ok: true,
        // 'message': 'Thay đổi thông tin thành công'
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async changePassword(
    currentUser: User,
    input: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    try {
      const { oldPassword, newPassword } = input;
      const user = await this.userRepo.findOne({
        where: { id: currentUser.id },
        select: ['password', 'id'],
      });
      console.log(user);

      //kiem tra User ton tai khong
      if (!user) return createError('Input', 'Người dùng không tồn tại');

      //kiem tra mat khau hien tai dung hay khong
      if (user.password) {
        if (!(await user.checkPassword(oldPassword)))
          return createError('Input', 'Mật khẩu hiện tại không đúng');

        //kiem tra mat khau cu va mat khau moi co trung nhau khong
        if (await user.checkPassword(newPassword))
          return createError(
            'Input',
            'Mật khẩu mới không được trùng mật khẩu cũ',
          );
      }
      console.log(user);
      user.password = newPassword;
      await this.userRepo.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
