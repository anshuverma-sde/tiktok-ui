import axiosInstance from '../axiosInstance';

import {
  LoginResponse,
  LoginCredentials,
  SignUpCredentials,
  RefreshTokenResponse,
  ResetPasswordCredentials,
} from '../types/auth.types';

import { ApiResponse } from '../types/api.types';

export class AuthService {
  // Login API call
  static async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      '/api/v1/auth/login/',
      credentials
    );
    return response.data;
  }

  // SignUp API call
  static async signUp(credentials: SignUpCredentials): Promise<ApiResponse> {
    const response = await axiosInstance.post<ApiResponse>(
      '/api/v1/auth/signup/',
      credentials
    );
    return response.data;
  }

  static async logout(): Promise<ApiResponse> {
    const response = await axiosInstance.post<ApiResponse>(
      '/api/v1/auth/logout/'
    );
    return response.data;
  }

  static async forgotPassword(payload: { email: string }) {
    const response = await axiosInstance.post<ApiResponse>(
      '/api/v1/auth/forgot-password/',
      payload
    );
    return response.data;
  }

  static async resetPassword(payload: ResetPasswordCredentials) {
    const response = await axiosInstance.post<ApiResponse>(
      '/api/v1/auth/reset-password/',
      payload
    );
    return response.data;
  }

  static async verifyEmail(payload: { token: string }) {
    const response = await axiosInstance.post<ApiResponse>(
      '/api/v1/auth/verify-email/',
      payload
    );
    return response.data;
  }

  static async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await axiosInstance.post('/api/v1/auth/refresh-token', {}, {
      withCredentials: true
    });
    return response.data;
  }
}
