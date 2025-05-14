'use client';

import { useQuery } from '@tanstack/react-query';
import { useLoaderStore } from '@/stores/useLoaderStore';
import { UserService } from '../services/userService';

export const useProfileQuery = () => {
  const { showLoader, hideLoader } = useLoaderStore();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      showLoader('Loading your profile...');
      try {
        return await UserService.me();
      } finally {
        hideLoader();
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};
