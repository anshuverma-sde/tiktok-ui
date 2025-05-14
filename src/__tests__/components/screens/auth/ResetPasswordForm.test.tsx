import React from 'react';
import { render, screen } from '@testing-library/react';
import ResetPasswordForm from '@/components/screens/auth/ResetPasswordForm';
import { useResetPasswordMutation } from '@/lib/api/mutations/auth';

// Mock the next/navigation hook
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn((param) => {
      if (param === 'token') return 'valid-token';
      return null;
    }),
  }),
}));

// Mock the authentication mutation
jest.mock('@/lib/api/mutations/auth', () => ({
  useResetPasswordMutation: jest.fn(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return children;
  };
});

describe('ResetPasswordForm', () => {
  const mockMutate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementation
    (useResetPasswordMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    });
  });

  it('renders the reset password form', () => {
    render(<ResetPasswordForm />);
    
    expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
    expect(screen.getByText('Enter your new password below')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
    expect(screen.getByText('Remember your password?')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
  
  it('shows loading state during form submission', () => {
    (useResetPasswordMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: null,
    });
    
    render(<ResetPasswordForm />);
    
    // The loading indicator should be visible
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
}); 