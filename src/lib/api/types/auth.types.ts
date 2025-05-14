import { IUser } from '@/types/user';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe:boolean;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

export interface ResetPasswordCredentials {
  token: string;
  newPassword: string;
}

export interface VerifyEmailCredentials {
  token: string;
}

export interface JwtPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export interface LoginResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number; 
}
