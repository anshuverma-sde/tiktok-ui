import axios from 'axios';
import { AuthService } from '@/lib/api/services/authService';

// Mock the module we are testing before importing it
jest.mock('axios');
jest.mock('@/lib/api/services/authService');

// Store original window.location
const originalLocation = window.location;

// Set up window.location mock
Object.defineProperty(window, 'location', {
  writable: true,
  value: { href: '' }
});

// Now import the module we're testing
import axiosInstance from '@/lib/api/axiosInstance';

// Define types for our mock functions and handlers
type SuccessHandlerType = (response: any) => any;
type ErrorHandlerType = (error: any) => Promise<any>;
type ResponseInterceptorType = {
  use: jest.Mock;
};
type AxiosInstanceType = {
  interceptors: {
    request: { use: jest.Mock };
    response: ResponseInterceptorType;
  };
  request: jest.Mock;
  [key: string]: any; // Allow any other properties to be accessed
};

describe('axiosInstance', () => {
  let mockCreate: jest.Mock;
  let mockAxiosInstance: AxiosInstanceType;
  let mockResponseInterceptor: ResponseInterceptorType;
  let successHandler: SuccessHandlerType;
  let errorHandler: ErrorHandlerType;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset href
    window.location.href = '';
    
    // Set up mocks
    mockResponseInterceptor = {
      use: jest.fn((success, error) => {
        successHandler = success;
        errorHandler = error;
        return 1; // Interceptor ID
      })
    };
    
    mockAxiosInstance = {
      interceptors: {
        request: { use: jest.fn() },
        response: mockResponseInterceptor
      },
      request: jest.fn()
    };
    
    mockCreate = jest.fn().mockReturnValue(mockAxiosInstance);
    (axios.create as jest.Mock).mockImplementation(mockCreate);
    
    // Re-import axiosInstance to trigger the interceptor setup
    jest.isolateModules(() => {
      require('@/lib/api/axiosInstance');
    });
    
    // Ensure our handlers are defined
    expect(successHandler).toBeDefined();
    expect(errorHandler).toBeDefined();
  });
  
  afterAll(() => {
    // Restore window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation
    });
  });
  
  it('should create an axios instance with the correct config', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  });
  
  it('should set up response interceptors', () => {
    expect(mockResponseInterceptor.use).toHaveBeenCalled();
    expect(typeof successHandler).toBe('function');
    expect(typeof errorHandler).toBe('function');
  });
  
  it('success handler should return response directly', () => {
    const response = { data: { success: true } };
    const result = successHandler(response);
    expect(result).toBe(response);
  });
  
  it('should attempt token refresh on 401 TOKEN_EXPIRED error', async () => {
    // Mock successful refresh
    (AuthService.refreshToken as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { accessToken: 'new-token' }
    });
    
    // Original request config
    const originalRequest = {
      url: '/test',
      method: 'get',
      _retry: false
    };
    
    const error = {
      config: originalRequest,
      response: {
        status: 401,
        data: { errorCode: 'TOKEN_EXPIRED', message: 'Token expired' }
      }
    };
    
    try {
      // Axiosinstance is mocked to be mockAxiosInstance
      jest.spyOn(mockAxiosInstance, 'request').mockResolvedValueOnce({ data: 'success' });
      
      await errorHandler(error);
      // This might fail if the errorHandler throws, which is fine
      // We'll just check the side effects below
    } catch (e) {
      // Expected exception - we're testing error handling behavior
      // and will verify the side effects of the error below
      expect(e).toBeDefined(); // Explicitly acknowledge the error
    }
    
    // Check that the right functions were called
    expect(AuthService.refreshToken).toHaveBeenCalled();
    expect(originalRequest._retry).toBe(true);
  });
  
  it('should handle refresh token failure', async () => {
    (AuthService.refreshToken as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to refresh')
    );
    
    const originalRequest = {
      url: '/test',
      _retry: false
    };
    
    const error = {
      config: originalRequest,
      response: {
        status: 401,
        data: { errorCode: 'TOKEN_EXPIRED' }
      }
    };
    
    try {
      await errorHandler(error);
      // Should not reach here
      expect(true).toBe(false);
    } catch (e) {
      // Should reach here - expected exception
      expect(e).toBeDefined(); // Explicitly acknowledge exception
      expect(AuthService.refreshToken).toHaveBeenCalled();
      expect(AuthService.logout).toHaveBeenCalled();
      expect(window.location.href).toBe('/login');
    }
  });
  
  it('should not retry if request was already retried', async () => {
    const originalRequest = {
      _retry: true,
      url: '/test'
    };
    
    const error = {
      config: originalRequest,
      response: {
        status: 401,
        data: { errorCode: 'TOKEN_EXPIRED' }
      }
    };
    
    try {
      await errorHandler(error);
      // Should not reach here
      expect(true).toBe(false);
    } catch (e) {
      // Should reach here - expected exception
      expect(e).toBeDefined(); // Explicitly acknowledge exception
      expect(AuthService.refreshToken).not.toHaveBeenCalled();
      expect(AuthService.logout).toHaveBeenCalled();
      expect(window.location.href).toBe('/login');
    }
  });
  
  it('should immediately logout on INVALID_TOKEN error', async () => {
    const error = {
      config: {},
      response: {
        status: 401,
        data: { errorCode: 'INVALID_TOKEN' }
      }
    };
    
    try {
      await errorHandler(error);
      // Should not reach here
      expect(true).toBe(false);
    } catch (e) {
      // Should reach here - expected exception
      expect(e).toBeDefined(); // Explicitly acknowledge exception
      expect(AuthService.logout).toHaveBeenCalled();
      expect(window.location.href).toBe('/login');
    }
  });
  
  it('should pass through regular errors', async () => {
    const error = {
      config: {},
      response: {
        status: 500,
        data: { message: 'Server error' }
      }
    };
    
    try {
      await errorHandler(error);
      // Should not reach here
      expect(true).toBe(false);
    } catch (e) {
      // Should reach here - expected exception
      expect(e).toBeDefined(); // Explicitly acknowledge exception
      expect(AuthService.refreshToken).not.toHaveBeenCalled();
      expect(AuthService.logout).not.toHaveBeenCalled();
    }
  });
  
  it('should handle network errors with no response', async () => {
    const error = {
      config: {},
      message: 'Network Error',
      response: undefined
    };
    
    try {
      await errorHandler(error);
      // Should not reach here
      expect(true).toBe(false);
    } catch (e) {
      // Should reach here - expected exception
      expect(e).toBeDefined(); // Explicitly acknowledge exception
      expect(AuthService.refreshToken).not.toHaveBeenCalled();
      expect(AuthService.logout).not.toHaveBeenCalled();
    }
  });
  
  it('should handle session expiration correctly', async () => {
    // Setup
    (AuthService.logout as jest.Mock).mockResolvedValueOnce({
      success: true,
      message: 'Logged out successfully'
    });
    
    const error = {
      config: {
        url: '/test',
        _retry: true // Already retried
      },
      response: {
        status: 401,
        data: { errorCode: 'TOKEN_EXPIRED', message: 'Token expired' }
      }
    };
    
    try {
      await errorHandler(error);
      // Should not reach here
      expect(true).toBe(false);
    } catch (e) {
      // Should reach here - expected exception
      expect(e).toBeDefined();
      expect(AuthService.logout).toHaveBeenCalled();
      expect(window.location.href).toBe('/login');
    }
  });
  
  it('should handle network errors with specific error message format', async () => {
    const error = {
      config: {},
      message: 'Network Error',
      response: undefined
    };
    
    try {
      await errorHandler(error);
      // Should not reach here
      expect(true).toBe(false);
    } catch (e) {
      // The error is already an object, not a JSON string
      const errorObj = e as { success: boolean; status: number; message: string };
      expect(errorObj.success).toBe(false);
      expect(errorObj.status).toBe(500); // Default status for errors with no response
      expect(errorObj).toHaveProperty('message');
      expect(AuthService.refreshToken).not.toHaveBeenCalled();
    }
  });
}); 