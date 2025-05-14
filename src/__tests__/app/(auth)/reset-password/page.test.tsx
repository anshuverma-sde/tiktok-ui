import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSearchParams, useRouter } from 'next/navigation';
import ResetPasswordPage from '@/app/(auth)/reset-password/page';
import { useResetPasswordMutation } from '@/lib/api/mutations/auth';

// Mock the required modules
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/lib/api/mutations/auth', () => ({
  useResetPasswordMutation: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} data-testid="mock-image" />,
}));

// Mock material UI components
jest.mock('@mui/material', () => ({
  Box: ({ children, component, onSubmit, ...props }: any) => {
    if (component === 'form' && onSubmit) {
      return (
        <form onSubmit={onSubmit} data-testid="reset-form" {...props}>
          {children}
        </form>
      );
    }
    return <div {...props}>{children}</div>;
  },
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div data-testid="card-content" {...props}>{children}</div>,
  TextField: ({ label, type, error, helperText, slotProps, InputProps, ...props }: any) => {
    // Handle both slotProps.input and InputProps approaches
    const endAdornment = slotProps?.input?.endAdornment || InputProps?.endAdornment;
    
    return (
      <div data-testid={`text-field-${label?.toLowerCase().replace(/\s/g, '-')}`}>
        <label htmlFor={label}>{label}</label>
        <input
          type={type}
          id={label}
          name={props.name}
          aria-invalid={error}
          {...props}
        />
        {endAdornment && <div data-testid="input-adornment">{endAdornment}</div>}
        {error && helperText && <span data-testid="error-text">{helperText}</span>}
      </div>
    );
  },
  Button: ({ children, onClick, type, disabled, ...props }: any) => (
    <button onClick={onClick} type={type} disabled={disabled} data-testid="submit-button" {...props}>
      {children}
    </button>
  ),
  Typography: ({ children, variant, ...props }: any) => (
    <div data-testid={`typography-${variant}`} {...props}>
      {children}
    </div>
  ),
  CircularProgress: () => <div data-testid="circular-progress">Loading...</div>,
  InputAdornment: ({ children, ...props }: any) => <div data-testid="input-adornment" {...props}>{children}</div>,
  IconButton: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="icon-button" {...props}>
      {children}
    </button>
  ),
  Alert: ({ children, severity, ...props }: any) => (
    <div data-testid={`alert-${severity}`} {...props}>
      {children}
    </div>
  ),
}));

jest.mock('@mui/icons-material', () => ({
  Visibility: () => <span data-testid="visibility-icon">visibility</span>,
  VisibilityOff: () => <span data-testid="visibility-off-icon">visibility-off</span>,
  CheckCircleOutline: () => <span data-testid="check-circle-icon">check-circle</span>,
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div data-testid="motion-div" {...props}>{children}</div>,
  },
}));

describe('ResetPasswordPage', () => {
  // Set up common mocks and test data
  const mockPush = jest.fn();
  const mockToken = 'test-token';
  const mockMutateFn = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mocks
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
    
    // Default mock for token - valid token
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn((param) => param === 'token' ? mockToken : null)
    });
    
    (useResetPasswordMutation as jest.Mock).mockReturnValue({
      mutate: mockMutateFn,
      isPending: false
    });
  });
  
  it('renders the page with valid token', () => {
    render(<ResetPasswordPage />);
    
    // Check if the form renders correctly
    expect(screen.getByTestId('reset-form')).toBeInTheDocument();
    expect(screen.getByTestId('text-field-new-password')).toBeInTheDocument();
    expect(screen.getByTestId('text-field-confirm-password')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
  });
  
  it('renders missing token view when no token is present', () => {
    // Only in this test we mock no token
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(() => null)
    });
    
    render(<ResetPasswordPage />);
    
    // Should show error about missing token
    expect(screen.getByTestId('alert-error')).toBeInTheDocument();
    expect(screen.getByText('Request new link')).toBeInTheDocument();
    expect(screen.queryByTestId('reset-form')).not.toBeInTheDocument();
  });
  
  it('toggles password visibility when clicking on the visibility icons', async () => {
    render(<ResetPasswordPage />);
    
    // Simulate clicking on the visibility toggle buttons
    const buttons = screen.getAllByTestId('icon-button');
    expect(buttons.length).toBeGreaterThanOrEqual(2); // Should have at least 2 buttons
    
    // Toggle new password visibility
    fireEvent.click(buttons[0]);
    await waitFor(() => {
      expect(screen.getByLabelText('New Password')).toHaveAttribute('type', 'text');
    });
    
    // Toggle it back
    fireEvent.click(buttons[0]);
    await waitFor(() => {
      expect(screen.getByLabelText('New Password')).toHaveAttribute('type', 'password');
    });
    
    // Toggle confirm password visibility
    fireEvent.click(buttons[1]); 
    await waitFor(() => {
      expect(screen.getByLabelText('Confirm Password')).toHaveAttribute('type', 'text');
    });
  });
  
  it('submits the form with valid data', async () => {
    render(<ResetPasswordPage />);
    
    const newPasswordField = screen.getByLabelText('New Password');
    const confirmPasswordField = screen.getByLabelText('Confirm Password');
    
    // Fill out the form
    fireEvent.change(newPasswordField, { target: { value: 'ValidPassword1!' } });
    fireEvent.change(confirmPasswordField, { target: { value: 'ValidPassword1!' } });
    
    // Submit the form - we need to trigger the onSubmit directly since we're mocking the form
    const form = screen.getByTestId('reset-form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(mockMutateFn).toHaveBeenCalledWith(
        { token: mockToken, newPassword: 'ValidPassword1!' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function)
        })
      );
    });
  });
  
  it('shows success view after password reset', async () => {
    // Mock the success callback directly
    (useResetPasswordMutation as jest.Mock).mockReturnValue({
      mutate: (data: any, callbacks: any) => {
        // Immediately call onSuccess to trigger the success state
        callbacks.onSuccess();
      },
      isPending: false
    });
    
    // Prepare to capture the useEffect setTimeout
    jest.useFakeTimers();
    
    render(<ResetPasswordPage />);
    
    const newPasswordField = screen.getByLabelText('New Password');
    const confirmPasswordField = screen.getByLabelText('Confirm Password');
    
    // Fill out and submit the form
    fireEvent.change(newPasswordField, { target: { value: 'ValidPassword1!' } });
    fireEvent.change(confirmPasswordField, { target: { value: 'ValidPassword1!' } });
    
    // Submit the form
    const form = screen.getByTestId('reset-form');
    fireEvent.submit(form);
    
    // Wait for success view to appear
    await waitFor(() => {
      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
      expect(screen.getByText('Password Reset!')).toBeInTheDocument();
      expect(screen.getByText('Back to Login Now')).toBeInTheDocument();
    });
    
    // Fast-forward through the timeout
    jest.advanceTimersByTime(10000);
    
    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/login');
    
    // Clean up
    jest.useRealTimers();
  });
  
  it('shows error message when API returns an error', async () => {
    // Mock the error callback
    const errorMessage = 'Your reset link is invalid or expired. Please request a new password link.';
    (useResetPasswordMutation as jest.Mock).mockReturnValue({
      mutate: (data: any, callbacks: any) => {
        // Immediately call onError to trigger the error state
        callbacks.onError({ errorCode: 'INVALID_RESET_TOKEN', message: 'API error message' });
      },
      isPending: false
    });
    
    render(<ResetPasswordPage />);
    
    const newPasswordField = screen.getByLabelText('New Password');
    const confirmPasswordField = screen.getByLabelText('Confirm Password');
    
    // Fill out and submit the form
    fireEvent.change(newPasswordField, { target: { value: 'ValidPassword1!' } });
    fireEvent.change(confirmPasswordField, { target: { value: 'ValidPassword1!' } });
    
    // Submit the form
    const form = screen.getByTestId('reset-form');
    fireEvent.submit(form);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByTestId('alert-error')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
  
  it('shows loading state during form submission', () => {
    (useResetPasswordMutation as jest.Mock).mockReturnValue({
      mutate: mockMutateFn,
      isPending: true
    });
    
    render(<ResetPasswordPage />);
    
    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
    
    // Button should be disabled
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });
}); 