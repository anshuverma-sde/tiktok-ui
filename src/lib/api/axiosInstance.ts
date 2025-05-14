import axios, { InternalAxiosRequestConfig } from 'axios';
import { AuthService } from './services/authService';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

class ApiError extends Error {
  success: boolean;
  status: number;
  cause?: any;

  constructor(message: string, status: number = 500, errorData: any = {}) {
    super(message);
    this.name = 'ApiError';
    this.success = false;
    this.status = status;
    this.cause = errorData;
    
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const handleSessionExpiration = async () => {
  try {
    await AuthService.logout();
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Refresh token logic on 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorData = error.response?.data || {};
    const status = error.response?.status || 500;
    const errorCode = error.response?.data?.errorCode;
    const originalRequest = error.config as InternalAxiosRequestConfig;

    console.log('API Error:', {
      status,
      url: originalRequest.url,
      errorCode,
      message: errorData.message || error.message,
    });

    if (
      status === 401 &&
      (errorCode === 'TOKEN_EXPIRED' || errorCode === 'INVALID_TOKEN') &&
      typeof window !== 'undefined'
    ) {
      console.log('Attempting token refresh...');
      
      if (originalRequest._retry) {
        console.log('Giving up after retry attempt');
        await handleSessionExpiration();
        const errorMessage = 'Session expired, please log in again';
        return Promise.reject(new ApiError(errorMessage, 401, errorData));
      }

      originalRequest._retry = true;

      try {
        console.log('Calling refresh token API...');
        const refreshResponse = await AuthService.refreshToken();
        console.log('Refresh response:', refreshResponse);

        if (!refreshResponse?.success || !refreshResponse?.data) {
          throw new Error(
            refreshResponse?.message || 'Failed to refresh token'
          );
        }

        console.log('Token refreshed successfully, retrying original request');
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError);
        await handleSessionExpiration();
        const errorMessage = 'Your session has expired. Please log in again.';
        return Promise.reject(new ApiError(errorMessage, 401, errorData));
      }
    }

    const errorMessage = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new ApiError(errorMessage, status, errorData));
  }
);

export default axiosInstance;
