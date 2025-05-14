import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/stores/useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login user and update state', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      companyName: 'Test Company',
      picture: 'profile.jpg',
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    act(() => {
      result.current.login(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should logout user and reset state', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    };

    act(() => {
      result.current.login(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should update user data', () => {
    const { result } = renderHook(() => useAuthStore());
    const initialUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    };

    act(() => {
      result.current.login(initialUser);
    });

    const updatedUserData = {
      id: '123',
      name: 'Updated Name',
      email: 'test@example.com',
      role: 'user',
      companyName: 'Updated Company',
    };

    act(() => {
      result.current.setUser(updatedUserData);
    });

    expect(result.current.user).toEqual(updatedUserData);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should update user role', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    };

    act(() => {
      result.current.login(mockUser);
    });

    act(() => {
      result.current.setRole('admin');
    });

    expect(result.current.user?.role).toBe('admin');
  });

  it('should not update role if user is not logged in', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setRole('admin');
    });

    expect(result.current.user).toBeNull();
  });
}); 