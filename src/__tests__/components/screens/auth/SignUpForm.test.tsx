import React from 'react';
import { render, screen } from '@testing-library/react';
import SignUpPage from '@/components/screens/auth/SignUpForm';
import { useSignupMutation } from '@/lib/api/mutations/auth';

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn((param) => {
      if (param === 'plan') return 'starter';
      if (param === 'billing') return 'monthly';
      return null;
    }),
  }),
}));

// Mock the authentication mutation
jest.mock('@/lib/api/mutations/auth', () => ({
  useSignupMutation: jest.fn(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return children;
  };
});

describe('SignUpPage', () => {
  const mockMutate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementation
    (useSignupMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('renders the signup form', () => {
    render(<SignUpPage />);
    
    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByText('Enter your information to get started')).toBeInTheDocument();
  });

  it('displays selected plan information from URL params', () => {
    render(<SignUpPage />);
    
    expect(screen.getByText('Selected Plan:')).toBeInTheDocument();
    expect(screen.getByText('Starter Plan (Monthly)')).toBeInTheDocument();
    expect(screen.getByText('Change plan')).toBeInTheDocument();
  });

  it('shows loading state during form submission', () => {
    (useSignupMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });
    
    render(<SignUpPage />);
    
    // The loading indicator should be visible
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
}); 