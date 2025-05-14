import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useVerifyEmailMutation } from '@/lib/api/mutations/auth';
import VerifyEmailPage from '@/components/screens/auth/verify-email';

// Mock the Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the framer-motion for animations
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock the auth mutation
jest.mock('@/lib/api/mutations/auth', () => ({
  useVerifyEmailMutation: jest.fn(),
}));

describe('VerifyEmailPage', () => {
  // Helper function to mock component state
  const renderWithState = (state: 'loading' | 'success' | 'error', errorMsg = '') => {
    // Mock useState to return predefined values
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [state, jest.fn()]);
    
    // Only mock the error message if we're in an error state
    if (state === 'error') {
      jest.spyOn(React, 'useState').mockImplementationOnce(() => [errorMsg, jest.fn()]);
    }
    
    (useVerifyEmailMutation as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(() => Promise.resolve({})),
      isLoading: false,
    });
    
    const result = render(<VerifyEmailPage emailToken="token-123" />);
    
    // Restore original useState
    jest.spyOn(React, 'useState').mockRestore();
    
    return result;
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    renderWithState('loading');
    expect(screen.getByText('Verifying your email…')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders success state correctly', () => {
    renderWithState('success');
    expect(screen.getByText('Email Verified!')).toBeInTheDocument();
    expect(screen.getByText('Your email has been successfully verified.')).toBeInTheDocument();
    expect(screen.getByText('Redirecting to login…')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    renderWithState('error', 'Test error message');
    expect(screen.getByText('Verification Failed')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('redirects to login when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithState('success');
    
    const loginButton = screen.getByRole('button', { name: 'Back to Login' });
    await user.click(loginButton);
    
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
}); 