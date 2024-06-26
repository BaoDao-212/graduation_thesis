import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import {
  LoginInput,
  LoginOutput,
  NewAccessTokenInput,
  NewAccessTokenOutput,
  RegisterUserInput,
  RegisterUserOutput,
  ChangePasswordInput,
  ChangePasswordOutput,
  ListUserOutput,
  ForgotPasswordOutput,
  ForgotPasswordInput,
  RefreshTokenInput,
  LoginGoogleInput,
} from './dto/auth.dto';
import { Roles } from './role.decorator';
import { CurrentUser } from './user.decorator';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('/auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    summary: 'Register User',
  })
  @Post('register')
  @ApiOkResponse({ type: RegisterUserOutput })
  async registerUser(
    @Body() input: RegisterUserInput,
  ): Promise<RegisterUserOutput> {
    return this.authService.registerUser(input);
  }

  @ApiOperation({
    summary: 'Login User',
  })
  @Post('/login')
  @ApiOkResponse({ type: LoginOutput })
  async login(@Body() input: LoginInput): Promise<LoginOutput> {
    return this.authService.login(input);
  }
  @ApiOperation({
    summary: 'Refresh Access Token User',
  })
  @Post('/refresh-token')
  @ApiOkResponse({ type: LoginOutput })
  async refreshToken(@Body() input: RefreshTokenInput): Promise<LoginOutput> {
    return this.authService.refreshToken(input.refreshToken);
  }
  @ApiOperation({
    summary: 'New Access Token User',
  })
  @Get('/new-token')
  @ApiOkResponse({ type: NewAccessTokenOutput })
  async newAccessToken(
    @Body() input: NewAccessTokenInput,
  ): Promise<NewAccessTokenOutput> {
    return this.authService.newAccessToken(input);
  }

  @ApiOperation({
    summary: 'New Access Token User',
  })
  @Post('change-password')
  @ApiOkResponse({ type: ChangePasswordOutput })
  @ApiSecurity('admin')
  @Roles(['Any'])
  async changePassword(
    @CurrentUser() user: User,
    @Body() input: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    return this.authService.changePassword(user, input);
  }

  @ApiOperation({
    summary: 'New Access Token User',
  })
  @Get('list')
  @ApiOkResponse({ type: ListUserOutput })
  @ApiSecurity('admin')
  @Roles(['Admin'])
  async listUser(): Promise<ListUserOutput> {
    return this.authService.listUser();
  }
  @ApiOperation({
    summary: 'For Get Password',
  })
  @Post('forgot-password')
  @ApiOkResponse({ type: ForgotPasswordOutput })
  async forgetPassword(
    @Body() input: ForgotPasswordInput,
  ): Promise<ForgotPasswordOutput> {
    return this.authService.forgotPassword(input);
  }
  @ApiOperation({
    summary: 'login with google',
  })
  @Post('login-google')
  @ApiOkResponse({ type: LoginOutput })
  async loginWithGoogle(
    @Body() input: LoginGoogleInput,
  ): Promise<LoginOutput> {
    return this.authService.loginWithGoogle(input);
  }
  @ApiOperation({
    summary: 'logout',
  })
  @Get('logout')
  @ApiOkResponse({ type: ForgotPasswordOutput })
  async logout(@CurrentUser() user: User): Promise<ForgotPasswordOutput> {
    return this.authService.logout(user);
  }
}
