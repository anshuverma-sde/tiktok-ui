// Create mock functions before any imports
const mockPush = jest.fn();
const mockShowLoader = jest.fn();
const mockHideLoader = jest.fn();
const mockLogin = jest.fn();
const mockLogout = jest.fn();
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();

// Mock the toast module first
jest.mock('react-hot-toast', () => {
  return {
    success: mockToastSuccess,
    error: mockToastError,
  };
});

// Mock tanstack query
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn().mockImplementation(options => {
    const mutationFn = options?.mutationFn;
    const onSuccess = options?.onSuccess;
    const onError = options?.onError;
    
    return {
      mutate: jest.fn(async variables => {
        try {
          const result = mutationFn?.(variables);
          if (result instanceof Promise) {
            const data = await result;
            onSuccess?.(data, variables);
          } else {
            onSuccess?.(result, variables);
          }
        } catch (error) {
          onError?.(error);
        }
      }),
      mutateAsync: jest.fn(),
      isLoading: false,
      isSuccess: false,
      isError: false,
      isIdle: true,
      data: undefined,
      error: null,
      reset: jest.fn(),
      status: 'idle',
      isPending: false,
    };
  })
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Define AuthStore type for selector parameter
type AuthStore = {
  login: jest.Mock;
  logout: jest.Mock;
};

// Mock stores
jest.mock('../../../../stores/useAuthStore', () => ({
  useAuthStore: jest.fn().mockImplementation((selector: (state: any) => unknown) => 
    selector({
      login: mockLogin,
      logout: mockLogout,
    })
  ),
}));

jest.mock('../../../../stores/useLoaderStore', () => ({
  useLoaderStore: jest.fn().mockReturnValue({
    showLoader: mockShowLoader,
    hideLoader: mockHideLoader,
  }),
}));

jest.mock('../../../../lib/api/services/authService');

// Now import modules
import { renderHook } from '@testing-library/react';
import { useLoginMutation, 
  useSignupMutation, 
  useForgotPasswordMutation, 
  useResetPasswordMutation, 
  useLogout,
  useVerifyEmailMutation 
} from '../../../../lib/api/mutations/auth';
import { AuthService } from '../../../../lib/api/services/authService';

describe('Auth Mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockShowLoader.mockClear();
    mockHideLoader.mockClear();
    mockPush.mockClear();
    mockToastSuccess.mockClear();
    mockToastError.mockClear();
    mockLogin.mockClear();
    mockLogout.mockClear();
  });

  describe('useLoginMutation', () => {
    it('should call AuthService.login with correct params', async () => {
      const loginData = { email: 'user@example.com', password: 'password123', rememberMe: true };
      
      // Mock required services
      (AuthService.login as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          user: { 
            _id: '123', 
            email: 'user@example.com', 
            role: 'user',
            name: 'User Name'
          },
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      });
      
      const { result } = renderHook(() => useLoginMutation());
      
      // Call the mutation
      result.current.mutate(loginData);
      
      // Verify interactions
      expect(mockShowLoader).toHaveBeenCalledWith('Signing in...');
      expect(AuthService.login).toHaveBeenCalledWith({
        email: loginData.email,
        password: loginData.password,
        rememberMe: loginData.rememberMe,
      });
    });
    
    it('should handle successful login', async () => {
      const userData = {
        user: { 
          _id: '123', 
          email: 'user@example.com', 
          role: 'user',
          name: 'User Name'
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      
      (AuthService.login as jest.Mock).mockResolvedValue({
        success: true,
        data: userData,
      });
      
      const { result } = renderHook(() => useLoginMutation());
      
      // Call the mutation and wait for it to complete
      await result.current.mutate({ 
        email: 'user@example.com', 
        password: 'password123'
      });
      
      // Verify all expected actions happened
      expect(mockShowLoader).toHaveBeenCalledWith('Signing in...');
      expect(mockHideLoader).toHaveBeenCalled();
      expect(mockLogin).toHaveBeenCalledWith({
        id: userData.user._id,
        email: userData.user.email,
        role: userData.user.role,
        name: userData.user.name,
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
      });
      expect(mockToastSuccess).toHaveBeenCalledWith('Login successful!');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
    
    it('should handle failed login with error message from server', async () => {
      const errorMessage = 'Invalid credentials';
      (AuthService.login as jest.Mock).mockResolvedValue({
        success: false,
        message: errorMessage,
      });
      
      const { result } = renderHook(() => useLoginMutation());
      
      // Call the mutation
      result.current.mutate({ email: 'user@example.com', password: 'wrongpassword' });
      
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify error handling
      expect(mockShowLoader).toHaveBeenCalledWith('Signing in...');
      expect(mockHideLoader).toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith(errorMessage);
    });
    
    it('should handle login API errors', async () => {
      const apiError = new Error('Network error');
      (AuthService.login as jest.Mock).mockRejectedValue(apiError);
      
      const { result } = renderHook(() => useLoginMutation());
      
      // Call the mutation
      result.current.mutate({ email: 'user@example.com', password: 'password123' });
      
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify error handling
      expect(mockShowLoader).toHaveBeenCalledWith('Signing in...');
      expect(mockHideLoader).toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith('Network error');
    });
  });
  
  describe('useSignupMutation', () => {
    it('should call AuthService.signUp with correct params', () => {
      const signupData = {
        name: 'User Name',
        email: 'user@example.com', 
        password: 'password123',
        companyName: 'Company Inc.'
      };
      
      (AuthService.signUp as jest.Mock).mockResolvedValue({
        success: true,
        message: 'User registered successfully',
      });
      
      const { result } = renderHook(() => useSignupMutation());
      
      // Call the mutation
      result.current.mutate(signupData);
      
      expect(mockShowLoader).toHaveBeenCalledWith('Signing up...');
      expect(AuthService.signUp).toHaveBeenCalledWith({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        companyName: signupData.companyName,
      });
    });
    
    it('should handle successful signup', async () => {
      const successResponse = {
        success: true,
        message: 'User registered successfully',
      };
      
      (AuthService.signUp as jest.Mock).mockResolvedValue(successResponse);
      
      const { result } = renderHook(() => useSignupMutation());
      
      // Call the mutation
      await result.current.mutate({
        name: 'User Name',
        email: 'user@example.com',
        password: 'password123',
        companyName: 'Company Inc.'
      });
      
      expect(mockShowLoader).toHaveBeenCalledWith('Signing up...');
      expect(mockHideLoader).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith(successResponse.message);
      // Note: The code doesn't navigate after signup, it just shows a success message
    });
    
    it('should handle signup failure', async () => {
      const errorMessage = 'Email already exists';
      (AuthService.signUp as jest.Mock).mockResolvedValue({
        success: false,
        message: errorMessage,
      });
      
      const { result } = renderHook(() => useSignupMutation());
      
      // Call the mutation
      result.current.mutate({
        name: 'User Name',
        email: 'existing@example.com',
        password: 'password123',
        companyName: 'Company Inc.'
      });
      
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(mockShowLoader).toHaveBeenCalledWith('Signing up...');
      expect(mockHideLoader).toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('useForgotPasswordMutation', () => {
    it('should call AuthService.forgotPassword with correct email', async () => {
      const email = 'user@example.com';
      
      (AuthService.forgotPassword as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Password reset link sent to your email'
      });
      
      const { result } = renderHook(() => useForgotPasswordMutation());
      
      // Call the mutation
      await result.current.mutate({ email });
      
      expect(mockShowLoader).toHaveBeenCalledWith('Sending Email...');
      expect(AuthService.forgotPassword).toHaveBeenCalledWith({ email });
      expect(mockHideLoader).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith('Password reset link sent to your email');
    });
    
    it('should handle forgotPassword API errors', async () => {
      const email = 'nonexistent@example.com';
      const errorMessage = 'User not found';
      
      (AuthService.forgotPassword as jest.Mock).mockResolvedValue({
        success: false,
        message: errorMessage
      });
      
      const { result } = renderHook(() => useForgotPasswordMutation());
      
      // Call the mutation
      result.current.mutate({ email });
      
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(mockShowLoader).toHaveBeenCalledWith('Sending Email...');
      expect(mockHideLoader).toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith(errorMessage);
    });
  });
  
  describe('useResetPasswordMutation', () => {
    it('should call AuthService.resetPassword with correct params', async () => {
      const resetData = {
        token: 'valid-reset-token',
        newPassword: 'newpassword123'
      };
      
      (AuthService.resetPassword as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Password has been reset successfully'
      });
      
      const { result } = renderHook(() => useResetPasswordMutation());
      
      // Call the mutation
      await result.current.mutate(resetData);
      
      expect(mockShowLoader).toHaveBeenCalledWith('Resetting...');
      expect(AuthService.resetPassword).toHaveBeenCalledWith(resetData);
      expect(mockHideLoader).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith('Password has been reset successfully');
    });
    
    it('should handle resetPassword failure', async () => {
      const resetData = {
        token: 'invalid-token',
        newPassword: 'newpassword123'
      };
      
      const errorMessage = 'Invalid or expired token';
      (AuthService.resetPassword as jest.Mock).mockResolvedValue({
        success: false,
        message: errorMessage
      });
      
      const { result } = renderHook(() => useResetPasswordMutation());
      
      // Call the mutation
      result.current.mutate(resetData);
      
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(mockShowLoader).toHaveBeenCalledWith('Resetting...');
      expect(mockHideLoader).toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith(errorMessage);
    });
  });
  
  describe('useLogout', () => {
    it('should call AuthService.logout', () => {
      (AuthService.logout as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Logged out successfully',
      });
      
      const { result } = renderHook(() => useLogout());
      
      // Call the mutation
      result.current.mutate();
      
      expect(mockShowLoader).toHaveBeenCalledWith('Signing out...');
      expect(AuthService.logout).toHaveBeenCalled();
    });
    
    it('should handle successful logout', async () => {
      (AuthService.logout as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Logged out successfully',
      });
      
      const { result } = renderHook(() => useLogout());
      
      // Call the mutation
      await result.current.mutate();
      
      expect(mockShowLoader).toHaveBeenCalledWith('Signing out...');
      expect(mockHideLoader).toHaveBeenCalled();
      expect(mockLogout).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith('Logged out successfully');
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
    
    it('should handle logout failure', async () => {
      const errorMessage = 'Network error';
      
      (AuthService.logout as jest.Mock).mockResolvedValue({
        success: false,
        message: errorMessage,
      });
      
      const { result } = renderHook(() => useLogout());
      
      // Call the mutation
      result.current.mutate();
      
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(mockShowLoader).toHaveBeenCalledWith('Signing out...');
      expect(mockHideLoader).toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith(errorMessage);
    });
  });
  
  describe('useVerifyEmailMutation', () => {
    it('should call AuthService.verifyEmail with correct token', async () => {
      const token = 'verification-token';
      
      (AuthService.verifyEmail as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Email verified successfully'
      });
      
      const { result } = renderHook(() => useVerifyEmailMutation());
      
      // Call the mutation
      await result.current.mutate(token);
      
      expect(mockShowLoader).toHaveBeenCalledWith('Verifying email...');
      expect(AuthService.verifyEmail).toHaveBeenCalledWith({ token });
      expect(mockHideLoader).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith('Email verified successfully');
    });
    
    it('should handle verifyEmail failure', async () => {
      const token = 'invalid-token';
      const errorMessage = 'Invalid or expired verification token';
      
      (AuthService.verifyEmail as jest.Mock).mockResolvedValue({
        success: false,
        message: errorMessage
      });
      
      const { result } = renderHook(() => useVerifyEmailMutation());
      
      // Call the mutation
      result.current.mutate(token);
      
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(mockShowLoader).toHaveBeenCalledWith('Verifying email...');
      expect(mockHideLoader).toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith(errorMessage);
    });
    
    it('should use the default message if no message is provided on success', async () => {
      const token = 'verification-token';
      
      (AuthService.verifyEmail as jest.Mock).mockResolvedValue({
        success: true,
      });
      
      const { result } = renderHook(() => useVerifyEmailMutation());
      
      // Call the mutation
      await result.current.mutate(token);
      
      expect(mockToastSuccess).toHaveBeenCalledWith('Email verified successfully');
    });
  });
}); 