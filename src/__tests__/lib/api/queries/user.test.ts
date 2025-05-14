import { renderHook, waitFor } from '@testing-library/react';
import { useProfileQuery } from '@/lib/api/queries/user';
import { UserService } from '@/lib/api/services/userService';
import { useLoaderStore } from '@/stores/useLoaderStore';
import * as reactQuery from '@tanstack/react-query';

// Mock the services
jest.mock('@/lib/api/services/userService', () => ({
  UserService: {
    me: jest.fn()
  }
}));

// Mock the loader store
jest.mock('@/stores/useLoaderStore');

// Mock the tanstack query provider
jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: jest.fn()
  };
});

describe('User Queries', () => {
  const mockShowLoader = jest.fn();
  const mockHideLoader = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useLoaderStore as unknown as jest.Mock).mockReturnValue({
      showLoader: mockShowLoader,
      hideLoader: mockHideLoader
    });
  });
  
  describe('useProfileQuery', () => {
    it('should use the correct query key', () => {
      // Setup spy to capture query options
      const useQuerySpy = jest.spyOn(reactQuery, 'useQuery');
      (useQuerySpy as jest.Mock).mockReturnValue({});
      
      // Execute hook
      renderHook(() => useProfileQuery());
      
      // Check that query key is correct
      expect(useQuerySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['profile']
        })
      );
    });
    
    it('should call showLoader and hideLoader when query function is executed', async () => {
      // Setup spy to capture query options
      const useQuerySpy = jest.spyOn(reactQuery, 'useQuery');
      
      // Setup mock response
      const mockResponse = {
        success: true,
        data: { _id: '123', name: 'Test User', email: 'test@example.com' },
        message: 'Profile fetched successfully'
      };
      (UserService.me as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      // Execute hook
      renderHook(() => useProfileQuery());
      
      // Extract the queryFn from the spy call
      const queryOptions = useQuerySpy.mock.calls[0][0];
      const queryFn = queryOptions?.queryFn as (() => Promise<any>) | undefined;
      
      // Make sure queryFn exists before calling it
      expect(queryFn).toBeDefined();
      if (queryFn) {
        // Execute the query function
        const response = await queryFn();
        
        // Assertions
        expect(mockShowLoader).toHaveBeenCalledWith('Loading your profile...');
        expect(UserService.me).toHaveBeenCalled();
        expect(response).toEqual(mockResponse);
        expect(mockHideLoader).toHaveBeenCalled();
      }
    });
    
    it('should call hideLoader even when the query fails', async () => {
      // Setup spy to capture query options
      const useQuerySpy = jest.spyOn(reactQuery, 'useQuery');
      
      // Setup mock error
      const mockError = new Error('Failed to fetch profile');
      (UserService.me as jest.Mock).mockRejectedValueOnce(mockError);
      
      // Execute hook
      renderHook(() => useProfileQuery());
      
      // Extract the queryFn from the spy call
      const queryOptions = useQuerySpy.mock.calls[0][0];
      const queryFn = queryOptions?.queryFn as (() => Promise<any>) | undefined;
      
      // Make sure queryFn exists before calling it
      expect(queryFn).toBeDefined();
      if (queryFn) {
        // Execute and handle the rejection
        await expect(queryFn()).rejects.toThrow('Failed to fetch profile');
        
        // Assertions - loader should still be hidden
        expect(mockShowLoader).toHaveBeenCalledWith('Loading your profile...');
        expect(mockHideLoader).toHaveBeenCalled();
      }
    });
    
    it('should have the correct query configuration', () => {
      // Setup spy to capture query options
      const useQuerySpy = jest.spyOn(reactQuery, 'useQuery');
      (useQuerySpy as jest.Mock).mockReturnValue({});
      
      renderHook(() => useProfileQuery());
      
      // Check that useQuery was called with correct config
      expect(useQuerySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['profile'],
          retry: 1,
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000
        })
      );
    });
  });
}); 