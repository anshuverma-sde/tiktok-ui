import { 
  LoginCredentials, 
  SignUpCredentials, 
  ResetPasswordCredentials,
  VerifyEmailCredentials,
  JwtPayload,
  LoginResponse,
  RefreshTokenResponse
} from '@/lib/api/types/auth.types';
import { IUser } from '@/types/user';

describe('Auth Types', () => {
  it('should define LoginCredentials interface correctly', () => {
    const loginCreds: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true
    };
    
    expect(loginCreds).toHaveProperty('email');
    expect(loginCreds).toHaveProperty('password');
    expect(loginCreds).toHaveProperty('rememberMe');
  });
  
  it('should define SignUpCredentials interface correctly', () => {
    const signupCreds: SignUpCredentials = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      companyName: 'Acme Inc'
    };
    
    expect(signupCreds).toHaveProperty('name');
    expect(signupCreds).toHaveProperty('email');
    expect(signupCreds).toHaveProperty('password');
    expect(signupCreds).toHaveProperty('companyName');
  });
  
  it('should define ResetPasswordCredentials interface correctly', () => {
    const resetCreds: ResetPasswordCredentials = {
      token: 'reset-token-123',
      newPassword: 'newpassword123'
    };
    
    expect(resetCreds).toHaveProperty('token');
    expect(resetCreds).toHaveProperty('newPassword');
  });
  
  it('should define VerifyEmailCredentials interface correctly', () => {
    const verifyCreds: VerifyEmailCredentials = {
      token: 'verify-token-123'
    };
    
    expect(verifyCreds).toHaveProperty('token');
  });
  
  it('should define JwtPayload interface correctly', () => {
    const payload: JwtPayload = {
      userId: 'user-123',
      role: 'admin',
      iat: 1615806225,
      exp: 1615892625
    };
    
    expect(payload).toHaveProperty('userId');
    expect(payload).toHaveProperty('role');
    expect(payload).toHaveProperty('iat');
    expect(payload).toHaveProperty('exp');
  });
  
  it('should define LoginResponse interface correctly', () => {
    const user: IUser = {
      _id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    };
    
    const loginResponse: LoginResponse = {
      user,
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-123'
    };
    
    expect(loginResponse).toHaveProperty('user');
    expect(loginResponse).toHaveProperty('accessToken');
    expect(loginResponse).toHaveProperty('refreshToken');
  });
  
  it('should define RefreshTokenResponse interface correctly', () => {
    const refreshResponse: RefreshTokenResponse = {
      accessToken: 'new-access-token-123',
      refreshToken: 'new-refresh-token-123',
      expiresIn: 3600
    };
    
    expect(refreshResponse).toHaveProperty('accessToken');
    expect(refreshResponse).toHaveProperty('refreshToken');
    expect(refreshResponse).toHaveProperty('expiresIn');
  });
}); 