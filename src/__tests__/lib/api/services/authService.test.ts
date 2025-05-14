import { AuthService } from '@/lib/api/services/authService';

describe('AuthService', () => {
  const mockAxiosInstance = (global as any).mockAxiosInstance;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should make a POST request to login endpoint', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: {
              _id: '123',
              name: 'Test User',
              email: 'test@example.com',
              role: 'user',
            },
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
          },
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.login({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/auth/login/', {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login error', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Invalid credentials',
          },
          status: 401,
          statusText: 'Unauthorized',
          headers: {
            'content-type': 'application/json'
          },
          config: {
            headers: {
              'Accept': 'application/json, text/plain, */*'
            }
          } as any,
        }
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      try {
        await AuthService.login({
          email: 'test@example.com',
          password: 'wrong-password',
          rememberMe: false,
        });
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.data.message).toEqual('Invalid credentials');
        expect(error.response.status).toEqual(401);
      }
    });
  });

  describe('signUp', () => {
    it('should make a POST request to signup endpoint', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'User registered successfully',
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.signUp({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        companyName: 'Test Company',
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/auth/signup/', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        companyName: 'Test Company',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle signup error', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Email already exists',
          },
          status: 400,
          statusText: 'Bad Request',
          headers: {
            'content-type': 'application/json'
          },
          config: {
            headers: {
              'Accept': 'application/json, text/plain, */*'
            }
          } as any,
        }
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      try {
        await AuthService.signUp({
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123',
          companyName: 'Test Company',
        });
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.data.message).toEqual('Email already exists');
        expect(error.response.status).toEqual(400);
      }
    });
  });

  describe('forgotPassword', () => {
    it('should make a POST request to forgot password endpoint', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Password reset email sent',
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.forgotPassword({
        email: 'test@example.com',
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/auth/forgot-password/', {
        email: 'test@example.com',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle forgot password error', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Email not found',
          },
          status: 404,
          statusText: 'Not Found',
          headers: {
            'content-type': 'application/json'
          },
          config: {
            headers: {
              'Accept': 'application/json, text/plain, */*'
            }
          } as any,
        }
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      try {
        await AuthService.forgotPassword({
          email: 'nonexistent@example.com',
        });
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.data.message).toEqual('Email not found');
        expect(error.response.status).toEqual(404);
      }
    });
  });

  describe('resetPassword', () => {
    it('should make a POST request to reset password endpoint', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Password reset successful',
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.resetPassword({
        token: 'reset-token',
        newPassword: 'newpassword123',
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/auth/reset-password/', {
        token: 'reset-token',
        newPassword: 'newpassword123',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle reset password error', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Invalid or expired token',
          },
          status: 400,
          statusText: 'Bad Request',
          headers: {
            'content-type': 'application/json'
          },
          config: {
            headers: {
              'Accept': 'application/json, text/plain, */*'
            }
          } as any,
        }
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      try {
        await AuthService.resetPassword({
          token: 'invalid-token',
          newPassword: 'newpassword123',
        });
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.data.message).toEqual('Invalid or expired token');
        expect(error.response.status).toEqual(400);
      }
    });
  });

  describe('logout', () => {
    it('should make a POST request to logout endpoint', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Logged out successfully',
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.logout();

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/auth/logout/');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle logout error', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Logout failed',
          },
          status: 500,
          statusText: 'Internal Server Error',
          headers: {
            'content-type': 'application/json'
          },
          config: {
            headers: {
              'Accept': 'application/json, text/plain, */*'
            }
          } as any,
        }
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      try {
        await AuthService.logout();
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.data.message).toEqual('Logout failed');
        expect(error.response.status).toEqual(500);
      }
    });
  });

  describe('verifyEmail', () => {
    it('should make a POST request to verify email endpoint', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Email verified successfully',
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.verifyEmail({
        token: 'verification-token',
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/auth/verify-email/', {
        token: 'verification-token',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle verify email error', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Invalid verification token',
          },
          status: 400,
          statusText: 'Bad Request',
          headers: {
            'content-type': 'application/json'
          },
          config: {
            headers: {
              'Accept': 'application/json, text/plain, */*'
            }
          } as any,
        }
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      try {
        await AuthService.verifyEmail({
          token: 'invalid-token',
        });
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.data.message).toEqual('Invalid verification token');
        expect(error.response.status).toEqual(400);
      }
    });
  });

  describe('refreshToken', () => {
    it('should make a POST request to refresh token endpoint', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            accessToken: 'new-access-token',
          },
          message: 'Token refreshed successfully',
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.refreshToken();

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/auth/refresh-token', {}, {
        withCredentials: true
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle refresh token error', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Invalid refresh token',
          },
          status: 401,
          statusText: 'Unauthorized',
          headers: {
            'content-type': 'application/json'
          },
          config: {
            headers: {
              'Accept': 'application/json, text/plain, */*'
            }
          } as any,
        }
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      try {
        await AuthService.refreshToken();
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.data.message).toEqual('Invalid refresh token');
        expect(error.response.status).toEqual(401);
      }
    });
  });
}); 