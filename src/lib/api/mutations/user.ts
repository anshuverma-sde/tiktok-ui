'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLoaderStore } from '@/stores/useLoaderStore';
import { UserService, UpdateProfileRequest, ChangePasswordRequest } from '../services/userService';
import { toast } from '@/components/ui/use-toast';

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const { showLoader, hideLoader } = useLoaderStore();
  
  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      showLoader('Updating your profile...');
      try {
        return await UserService.updateProfile(data);
      } finally {
        hideLoader();
      }
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: data.message || 'Profile updated successfully.',
      });
      
      // Invalidate and refetch user profile query
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to update profile. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

export const useChangePasswordMutation = () => {
  const { showLoader, hideLoader } = useLoaderStore();
  
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      showLoader('Updating your password...');
      try {
        return await UserService.changePassword(data);
      } finally {
        hideLoader();
      }
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: data?.message || 'Password changed successfully.',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to change password. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
}; 