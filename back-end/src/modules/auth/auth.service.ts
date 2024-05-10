import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';

import { Position, User } from 'src/entities/user.entity';
// import {Mailer}
import { Repository } from 'typeorm';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
  ListUserOutput,
  ForgotPasswordInput,
  LoginInput,
  LoginOutput,
  NewAccessTokenInput,
  NewAccessTokenOutput,
  RegisterUserInput,
  RegisterUserOutput,
} from './dto/auth.dto';
import { createError } from '../common/utils/createError';
import {
  ACCESS_TOKEN_EXPIRED_IN,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRED_IN,
  REFRESH_TOKEN_SECRET,
} from '../common/constants/constants';
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';
import { AccessTokenEntity } from 'src/entities/access-token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshTokenEntity) private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    @InjectRepository(AccessTokenEntity) private readonly accessTokenRepository: Repository<AccessTokenEntity>,
    private readonly configService: ConfigService,
  ) {}

  // TODO: thêm kiểm tra opt gửi về điện thoại
  async registerUser({
    password,
    username,
    confirmPassword,
  }: RegisterUserInput): Promise<RegisterUserOutput> {
    try {
      if (password !== confirmPassword)
        return createError('Input', 'Mật khẩu lặp lại không khớp');
      const user = await this.userRepo.findOne({
        where: {
          username,
        },
      });
      if (user) return createError('Input', 'Tài khoản đã được đăng kí');

      const userH =await this.userRepo.create({
        password,
        username,
        position: Position.User,
      });
      console.log(userH);
      
      await this.userRepo.save(userH);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async login({ password, username }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          username,
        },
        select: ['id', 'password'],
      });
      if (!user)
        return createError('Input', 'Người dùng không tồn tại trên hệ thống');
      if (!(await user.checkPassword(password)))
        return createError('Input', 'Mật khẩu không đúng');

      const accessToken = sign(
        {
          userId: user.id,
        },
        this.configService.get<string>(ACCESS_TOKEN_SECRET),
        {
          expiresIn: this.configService.get<string>(ACCESS_TOKEN_EXPIRED_IN),
        },
      );
      // create refresh token
      const rToken = sign( 
        {
          userId: user.id,
        },
        this.configService.get<string>(REFRESH_TOKEN_SECRET),
        {
          expiresIn: this.configService.get<string>(REFRESH_TOKEN_EXPIRED_IN),
        },
      );
      const refreshToken = this.refreshTokenRepository.create();
      const accessTokenEntity = this.accessTokenRepository.create();
      refreshToken.value = rToken;
      refreshToken.expired_at = this.configService.get<number>(REFRESH_TOKEN_EXPIRED_IN);
      refreshToken.created_at = new Date();
      accessTokenEntity.value = accessToken;
      accessTokenEntity.expired_at = this.configService.get<number>(ACCESS_TOKEN_EXPIRED_IN);
      accessTokenEntity.created_at = new Date();
      accessTokenEntity.user = user;
      await this.accessTokenRepository.save(accessTokenEntity);
      refreshToken.accessToken = accessTokenEntity;
      await this.refreshTokenRepository.save(refreshToken);
      return {
        ok: true,
        accessToken,
        refreshToken: rToken
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async refreshToken(refreshToken: string): Promise<LoginOutput> {
    try {
      const decoded = verify(
        refreshToken,
        this.configService.get<string>(REFRESH_TOKEN_SECRET),
      );
      if (!decoded || !decoded['userId']) throw new JsonWebTokenError('');
      const user = await this.userRepo.findOne({
        where: {
          id: decoded['userId'],
        },
      });
      if (!user) throw new JsonWebTokenError('');
      const accessToken = sign(
        {
          userId: user.id,
        },
        this.configService.get<string>(ACCESS_TOKEN_SECRET),
        {
          expiresIn: this.configService.get<string>(ACCESS_TOKEN_EXPIRED_IN),
        },
      );
      // create refresh token 

      const rToken = sign( 
        {
          userId: user.id,
        },
        this.configService.get<string>(REFRESH_TOKEN_SECRET),
        {
          expiresIn: this.configService.get<string>(REFRESH_TOKEN_EXPIRED_IN),
        },
      );
      const refreshTokenEntity =await this.refreshTokenRepository.findOne({
        where: {
          value: refreshToken,
        },
      });
      if (!refreshTokenEntity) throw new JsonWebTokenError('');

      const accessTokenEntity =await this.accessTokenRepository.findOne({
        where: {
          user: {
            id: user.id,
          },
        },
      });
      if (!accessTokenEntity) throw new JsonWebTokenError('');
      refreshTokenEntity.value = rToken;
      refreshTokenEntity.expired_at = this.configService.get<number>(REFRESH_TOKEN_EXPIRED_IN);
      refreshTokenEntity.created_at = new Date();
      accessTokenEntity.value = accessToken;
      accessTokenEntity.expired_at = this.configService.get<number>(ACCESS_TOKEN_EXPIRED_IN);
      accessTokenEntity.created_at = new Date();
      accessTokenEntity.user = user;
      await this.refreshTokenRepository.save(refreshTokenEntity);
      await this.accessTokenRepository.save(accessTokenEntity);
      return {
        ok: true,
        accessToken,
        refreshToken: rToken
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // danh sách người dùng
  async listUser(): Promise<ListUserOutput> {
    try {
      const users = await this.userRepo.find({
        where: {
          position: Position.User,
        },
        select: ['email', 'id', 'name', 'phone', 'position', 'username'],
      });
      return {
        ok: true,
        users,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async newAccessToken({
    accessToken,
  }: NewAccessTokenInput): Promise<NewAccessTokenOutput> {
    try {
      const decoded = verify(
        accessToken,
        this.configService.get<string>(ACCESS_TOKEN_SECRET),
      );
      if (!decoded || !decoded['userId']) throw new JsonWebTokenError('');
      const newAccessToken = sign(
        {
          userId: decoded['userId'],
        },
        this.configService.get<string>(ACCESS_TOKEN_SECRET),
        {
          expiresIn: this.configService.get<string>(ACCESS_TOKEN_EXPIRED_IN),
        },
      );
      return {
        ok: true,
        accessToken: newAccessToken,
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
      const { confirmNewPassword, newPassword, oldPassword } = input;
      const user = await this.userRepo.findOne({
        where: { id: currentUser.id },
        select: ['password', 'id'],
      });

      //kiem tra User ton tai khong
      if (!user) createError('Input', 'Người dùng không tồn tại');

      //kiem tra mat khau hien tai dung hay khong
      if (!(await user.checkPassword(oldPassword)))
        return createError('Input', 'Mật khẩu hiện tại không đúng');

      //Kiem tra mat khau moi va mat khau nhap lai co trung nhau hay khong
      if (newPassword !== confirmNewPassword)
        return createError('Input', 'Mật khẩu lặp lại không khớp');

      //kiem tra mat khau cu va mat khau moi co trung nhau khong
      if (await user.checkPassword(newPassword))
        return createError(
          'Input',
          'Mật khẩu mới không được trùng mật khẩu cũ',
        );

      user.password = newPassword;
      await this.userRepo.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  // TODO: Triển khai quên mật khẩu (khi chọn được dịch vụ SMS phù hợp)
  async forgotPassword(input: ForgotPasswordInput) {
    const { name, email } = input;
    try {
      const user = await this.userRepo.findOne({
        where: {
          username: name,
        },
      });
      if (!user) return createError('Input', 'Tài khoản không tồn tại');
      if (!user.email)
        return createError('Input', 'Tài khoản này chưa có email');
      if (user.email != email)
        return createError('Input', 'Email này không hợp lệ');
      const randomPassword = generateRandomPassword(8); // Độ dài mật khẩu 8 ký tự
      user.password = randomPassword;
      await this.userRepo.save(user);
      sendEmail(randomPassword, user.email);
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
const generateRandomPassword = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};

// Hàm gửi email với mật khẩu mới
async function sendEmail(newPassword, email) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodemailer = require('nodemailer');

  try {
    // Tạo transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'duytuongkhmt@gmail.com',
        pass: 'ayaozgozntxogrgy',
      },
    });

    // Cấu hình thông tin email
    const mailOptions = {
      from: 'L O',
      to: `${email}`,
      subject: 'Welcome to L.O',
      text: `Your new passwork is: ${newPassword}`,
    };
    // Gửi email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email đã được gửi:', info.response);
  } catch (error) {
    console.log('Lỗi khi gửi email:', error);
  }
}
