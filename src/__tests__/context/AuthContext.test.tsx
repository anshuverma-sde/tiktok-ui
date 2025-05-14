import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuthContext } from '@/context/AuthContext';
import { useProfileQuery } from '@/lib/api/queries/user';
import { useAuthStore } from '@/stores/useAuthStore';

// Mock the profile query
jest.mock('@/lib/api/queries/user', () => ({
  useProfileQuery: jest.fn(),
}));

// Mock the auth store
jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, error, isLoading, isFetching } = useAuthContext();
  return (
    <div>
      <div data-testid="is-loading">{isLoading.toString()}</div>
      <div data-testid="is-fetching">{isFetching.toString()}</div>
      <div data-testid="error">{error?.message || 'no error'}</div>
      <div data-testid="user-name">{user?.name || 'no user'}</div>
      <div data-testid="user-email">{user?.email || 'no email'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  const mockUser = {
    _id: '123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    picture: 'profile.jpg',
    companyName: 'Test Company',
  };

  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockSetUser);
  });

  it('should provide auth context with user data', () => {
    (useProfileQuery as jest.Mock).mockReturnValue({
      data: { data: mockUser },
      error: null,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      refetch: jest.fn(),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('is-fetching')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('no error');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    expect(mockSetUser).toHaveBeenCalledWith({
      id: mockUser._id,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
      picture: mockUser.picture,
      companyName: mockUser.companyName,
    });
  });

  it('should provide auth context without user data when not authenticated', () => {
    (useProfileQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      isFetching: false,
      isSuccess: false,
      refetch: jest.fn(),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('is-fetching')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('no error');
    expect(screen.getByTestId('user-name')).toHaveTextContent('no user');
    expect(screen.getByTestId('user-email')).toHaveTextContent('no email');
    expect(mockSetUser).not.toHaveBeenCalled();
  });

  it('should handle loading state', () => {
    (useProfileQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      isFetching: true,
      isSuccess: false,
      refetch: jest.fn(),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-loading')).toHaveTextContent('true');
    expect(screen.getByTestId('is-fetching')).toHaveTextContent('true');
    expect(screen.getByTestId('error')).toHaveTextContent('no error');
    expect(screen.getByTestId('user-name')).toHaveTextContent('no user');
    expect(screen.getByTestId('user-email')).toHaveTextContent('no email');
  });

  it('should handle error state', () => {
    const mockError = new Error('Failed to fetch user profile');
    (useProfileQuery as jest.Mock).mockReturnValue({
      data: null,
      error: mockError,
      isLoading: false,
      isFetching: false,
      isSuccess: false,
      refetch: jest.fn(),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('is-fetching')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch user profile');
    expect(screen.getByTestId('user-name')).toHaveTextContent('no user');
    expect(screen.getByTestId('user-email')).toHaveTextContent('no email');
  });
}); 