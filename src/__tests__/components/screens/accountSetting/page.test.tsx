import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AccountSettings from '@/components/screens/accountSetting/page';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLoaderStore } from '@/stores/useLoaderStore';

// Mock the useState hook to provide default values for the form
const mockSetState = jest.fn();
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useState: jest.fn((initialValue) => {
      // Handle different initial values
      if (typeof initialValue === 'string' && initialValue === 'account') {
        return ['account', mockSetState]; // activeTab
      } else if (initialValue && typeof initialValue === 'object') {
        // Check which form we're dealing with
        if ('name' in initialValue) {
          return [{
            name: 'Test User',
            email: 'test@example.com',
            company: 'Test Company',
          }, mockSetState]; // profileForm
        } else if ('currentPassword' in initialValue) {
          return [initialValue, mockSetState]; // passwordForm
        } else if ('emailNotifications' in initialValue) {
          return [initialValue, mockSetState]; // notificationPreferences
        }
      }
      // Default fallback
      return [initialValue, mockSetState];
    }),
  };
});

// Mock ResizeObserver
class ResizeObserverMock {
  // These methods need to exist but don't need to do anything in the test environment
  observe() {
    // Method intentionally left empty for testing purposes
    // In a real environment, this would track an element's size changes
  }
  
  unobserve() {
    // Method intentionally left empty for testing purposes
    // In a real environment, this would stop tracking an element's size changes
  }
  
  disconnect() {
    // Method intentionally left empty for testing purposes
    // In a real environment, this would disconnect the observer from all targets
  }
}

global.ResizeObserver = ResizeObserverMock;

// Mock auth store
jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: jest.fn()
}));

// Mock loader store
jest.mock('@/stores/useLoaderStore', () => ({
  useLoaderStore: jest.fn()
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

// Mock mutations
jest.mock('@/lib/api/mutations/user', () => ({
  useUpdateProfileMutation: () => ({
    mutate: jest.fn(),
    isPending: false
  }),
  useChangePasswordMutation: () => ({
    mutate: jest.fn(),
    isPending: false
  })
}));

// Mock the user query to avoid real API calls
jest.mock('@/lib/api/queries/user', () => ({
  useProfileQuery: () => ({
    data: {
      success: true,
      data: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        companyName: 'Test Company'
      }
    },
    isLoading: false,
    isError: false,
    error: null
  })
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('AccountSettings Component', () => {
  beforeEach(() => {
    queryClient.clear();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      },
      isAuthenticated: true
    });
    
    (useLoaderStore as unknown as jest.Mock).mockReturnValue({
      isLoading: false,
      message: '',
      showLoader: jest.fn(),
      hideLoader: jest.fn()
    });
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  it('renders account settings content', async () => {
    await act(async () => {
      renderWithProviders(<AccountSettings />);
    });
    
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage your account settings and preferences')).toBeInTheDocument();
  });

  it('renders account tab content', async () => {
    await act(async () => {
      renderWithProviders(<AccountSettings />);
    });
    
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage your account information and preferences')).toBeInTheDocument();
  });

  it('renders form elements', async () => {
    await act(async () => {
      renderWithProviders(<AccountSettings />);
    });
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });
}); 