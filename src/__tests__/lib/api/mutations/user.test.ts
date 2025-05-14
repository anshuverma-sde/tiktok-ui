import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateProfileMutation, useChangePasswordMutation } from '@/lib/api/mutations/user';
import { UserService } from '@/lib/api/services/userService';
import { useLoaderStore } from '@/stores/useLoaderStore';
import * as toast from '@/components/ui/use-toast';
import React from 'react';

// Create mocks
jest.mock('@/lib/api/services/userService', () => ({
  UserService: {
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
  },
}));

jest.mock('@/stores/useLoaderStore', () => ({
  useLoaderStore: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQueryClient: jest.fn().mockReturnValue({
      invalidateQueries: jest.fn(),
    }),
  };
});

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

const mockShowLoader = jest.fn();
const mockHideLoader = jest.fn();
const mockInvalidateQueries = jest.fn();

// Create wrapper for hooks
const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('User Mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLoaderStore as unknown as jest.Mock).mockReturnValue({
      showLoader: mockShowLoader,
      hideLoader: mockHideLoader,
    });
    (toast.toast as jest.Mock).mockImplementation(() => {});
  });

  describe('useUpdateProfileMutation', () => {
    const mockUpdateData = {
      name: 'Test User',
      companyName: 'Test Company',
    };

    const mockSuccessResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: { id: '1', name: 'Test User' },
    };

    it('should show loader when updating profile', async () => {
      (UserService.updateProfile as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

      const { result } = renderHook(() => useUpdateProfileMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdateData);

      await waitFor(() => {
        expect(mockShowLoader).toHaveBeenCalledWith('Updating your profile...');
      });
    });

    it('should call UserService.updateProfile with correct data', async () => {
      (UserService.updateProfile as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

      const { result } = renderHook(() => useUpdateProfileMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdateData);

      await waitFor(() => {
        expect(UserService.updateProfile).toHaveBeenCalledWith(mockUpdateData);
      });
    });

    it('should hide loader after updating profile', async () => {
      (UserService.updateProfile as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

      const { result } = renderHook(() => useUpdateProfileMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdateData);

      await waitFor(() => {
        expect(mockHideLoader).toHaveBeenCalled();
      });
    });

    it('should show success toast on successful profile update', async () => {
      (UserService.updateProfile as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

      const { result } = renderHook(() => useUpdateProfileMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdateData);

      await waitFor(() => {
        expect(toast.toast).toHaveBeenCalledWith({
          title: 'Success',
          description: mockSuccessResponse.message,
        });
      });
    });

    it('should invalidate profile queries on successful update', async () => {
      (UserService.updateProfile as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);
      
      const queryClient = {
        invalidateQueries: mockInvalidateQueries,
      };
      
      jest.requireMock('@tanstack/react-query').useQueryClient.mockReturnValue(queryClient);

      const { result } = renderHook(() => useUpdateProfileMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdateData);

      await waitFor(() => {
        expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['profile'] });
      });
    });

    it('should show error toast on update failure', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Failed to update profile',
          },
        },
        message: 'Failed to update profile. Please try again.',
      };

      (UserService.updateProfile as jest.Mock).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useUpdateProfileMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdateData);

      await waitFor(() => {
        expect(toast.toast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Failed to update profile. Please try again.',
          variant: 'destructive',
        });
      });
    });

    it('should show generic error message if error response is not structured', async () => {
      const mockError = new Error('Network error');

      (UserService.updateProfile as jest.Mock).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useUpdateProfileMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdateData);

      await waitFor(() => {
        expect(toast.toast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Network error',
          variant: 'destructive',
        });
      });
    });

    it('should hide loader even if update fails', async () => {
      (UserService.updateProfile as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

      const { result } = renderHook(() => useUpdateProfileMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdateData);

      await waitFor(() => {
        expect(mockHideLoader).toHaveBeenCalled();
      });
    });
  });

  describe('useChangePasswordMutation', () => {
    const mockPasswordData = {
      currentPassword: 'oldPass123',
      newPassword: 'newPass123',
      confirmPassword: 'newPass123',
    };

    const mockSuccessResponse = {
      success: true,
      message: 'Password changed successfully',
    };

    it('should show loader when changing password', async () => {
      (UserService.changePassword as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

      const { result } = renderHook(() => useChangePasswordMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPasswordData);

      await waitFor(() => {
        expect(mockShowLoader).toHaveBeenCalledWith('Updating your password...');
      });
    });

    it('should call UserService.changePassword with correct data', async () => {
      (UserService.changePassword as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

      const { result } = renderHook(() => useChangePasswordMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPasswordData);

      await waitFor(() => {
        expect(UserService.changePassword).toHaveBeenCalledWith(mockPasswordData);
      });
    });

    it('should hide loader after changing password', async () => {
      (UserService.changePassword as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

      const { result } = renderHook(() => useChangePasswordMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPasswordData);

      await waitFor(() => {
        expect(mockHideLoader).toHaveBeenCalled();
      });
    });

    it('should show success toast on successful password change', async () => {
      (UserService.changePassword as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

      const { result } = renderHook(() => useChangePasswordMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPasswordData);

      await waitFor(() => {
        expect(toast.toast).toHaveBeenCalledWith({
          title: 'Success',
          description: mockSuccessResponse.message,
        });
      });
    });

    it('should show error toast on password change failure', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Current password is incorrect',
          },
        },
        message: 'Failed to change password. Please try again.',
      };

      (UserService.changePassword as jest.Mock).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useChangePasswordMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPasswordData);

      await waitFor(() => {
        expect(toast.toast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Failed to change password. Please try again.',
          variant: 'destructive',
        });
      });
    });

    it('should show generic error message if error response is not structured', async () => {
      const mockError = new Error('Network error');

      (UserService.changePassword as jest.Mock).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useChangePasswordMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPasswordData);

      await waitFor(() => {
        expect(toast.toast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Network error',
          variant: 'destructive',
        });
      });
    });

    it('should hide loader even if password change fails', async () => {
      (UserService.changePassword as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

      const { result } = renderHook(() => useChangePasswordMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPasswordData);

      await waitFor(() => {
        expect(mockHideLoader).toHaveBeenCalled();
      });
    });
  });
}); 