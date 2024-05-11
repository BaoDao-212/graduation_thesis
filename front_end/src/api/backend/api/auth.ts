// @ts-ignore
/* eslint-disable */
import { request, type RequestOptions } from '@/utils/request';

/** 登录 POST /auth/login */
export async function authLogin(body: API.LoginDto, options?: RequestOptions) {
  return request<API.LoginToken>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 注册 POST /auth/register */
export async function authRegister(body: API.RegisterDto, options?: RequestOptions) {
  return request<any>('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 注册 POST /auth/forgot-password */
export async function authforgotPassword(body: API.ForgotPasswordDto, options?: RequestOptions) {
  return request<any>('/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
//TODO: Login with google
/** 登录 POST /auth/login-google */
export async function authLoginGoogle(body: API.LoginGoogleDto, options?: RequestOptions) {
  return request<API.LoginToken>('/auth/login-google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
