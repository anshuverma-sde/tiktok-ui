import { IUser } from '@/types/user';
import axiosInstance from '../axiosInstance';
import { ApiResponse } from '../types/api.types';

export interface UpdateProfileRequest {
  name: string;
  email?: string;
  companyName?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export class UserService {
  // Fetch Profile API call
  static async me(): Promise<ApiResponse<IUser>> {
    const response = await axiosInstance.get<ApiResponse<IUser>>('/api/v1/user/me');
    return response.data;
  }

  // Update Profile API call
  static async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<IUser>> {
    const response = await axiosInstance.put<ApiResponse<IUser>>('/api/v1/user/profile', data);
    return response.data;
  }

  // Change Password API call
  static async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post<ApiResponse<void>>('/api/v1/user/change-password', data);
    return response.data;
  }
}
