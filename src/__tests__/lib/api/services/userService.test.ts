import { UserService } from '@/lib/api/services/userService';

describe('UserService', () => {
  const mockAxiosInstance = (global as any).mockAxiosInstance;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('me', () => {
    it('should make a GET request to me endpoint', async () => {
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
          },
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await UserService.me();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/user/me');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle me endpoint error', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Failed to fetch user profile',
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

      mockAxiosInstance.get.mockRejectedValueOnce(mockError);

      try {
        await UserService.me();
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.data.message).toEqual('Failed to fetch user profile');
        expect(error.response.status).toEqual(500);
      }
    });
  });
  
  describe('updateProfile', () => {
    it('should make a PUT request to update profile endpoint', async () => {
      const updateData = {
        name: 'Updated User',
        companyName: 'Updated Company',
      };
      
      const mockResponse = {
        data: {
          success: true,
          message: 'Profile updated successfully',
          data: {
            _id: '123',
            name: 'Updated User',
            email: 'test@example.com',
            companyName: 'Updated Company',
          },
        },
      };
      
      mockAxiosInstance.put.mockResolvedValueOnce(mockResponse);
      
      const result = await UserService.updateProfile(updateData);
      
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/v1/user/profile', updateData);
      expect(result).toEqual(mockResponse.data);
    });
    
    it('should handle updateProfile endpoint error', async () => {
      const updateData = {
        name: 'Updated User',
      };
      
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Failed to update profile',
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
      
      mockAxiosInstance.put.mockRejectedValueOnce(mockError);
      
      try {
        await UserService.updateProfile(updateData);
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.data.message).toEqual('Failed to update profile');
        expect(error.response.status).toEqual(400);
      }
    });
  });
  
  describe('changePassword', () => {
    it('should make a POST request to change password endpoint', async () => {
      const passwordData = {
        currentPassword: 'oldPass123',
        newPassword: 'newPass123',
        confirmPassword: 'newPass123',
      };
      
      const mockResponse = {
        data: {
          success: true,
          message: 'Password changed successfully',
        },
      };
      
      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);
      
      const result = await UserService.changePassword(passwordData);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/user/change-password', passwordData);
      expect(result).toEqual(mockResponse.data);
    });
    
    it('should handle changePassword endpoint error', async () => {
      const passwordData = {
        currentPassword: 'incorrectOldPass',
        newPassword: 'newPass123',
        confirmPassword: 'newPass123',
      };
      
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Current password is incorrect',
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
        await UserService.changePassword(passwordData);
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.data.message).toEqual('Current password is incorrect');
        expect(error.response.status).toEqual(400);
      }
    });
  });
}); 