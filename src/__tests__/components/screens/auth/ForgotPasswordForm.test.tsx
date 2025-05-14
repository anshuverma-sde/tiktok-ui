import React from 'react';
import { render, screen } from '@testing-library/react';
import ForgotPasswordForm from '@/components/screens/auth/ForgotPasswordForm';
import { useForgotPasswordMutation } from '@/lib/api/mutations/auth';

// Mock the authentication mutation
jest.mock('@/lib/api/mutations/auth', () => ({
  useForgotPasswordMutation: jest.fn()
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('ForgotPasswordForm', () => {
  const mockMutate = jest.fn();
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementation
    (useForgotPasswordMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null
    });
  });

  it('renders the forgot password form', () => {
    render(<ForgotPasswordForm />);
    
    expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
    expect(screen.getByText(/Enter your email address/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
    expect(screen.getByText('Remember your password?')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('shows loading state during submission', () => {
    (useForgotPasswordMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: null
    });
    
    render(<ForgotPasswordForm />);
    
    expect(screen.getByRole('button', { name: 'Sending...' })).toBeInTheDocument();
  });
}); 