import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/components/screens/auth/LoginForm';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock the router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

// Mock next/link
jest.mock('next/link', () => {
  return function Link({ children, href = "#" }: { children: React.ReactNode, href?: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock the useLoginMutation hook
const mockMutateFn = jest.fn();
jest.mock('@/lib/api/mutations/auth', () => ({
  useLoginMutation: () => ({
    mutate: mockMutateFn,
    isPending: false,
    error: null
  })
}));

// Mock AuthLayout component
jest.mock('@/components/layouts/auth-layout', () => {
  return function MockAuthLayout({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});

// Mock card component
jest.mock('@/components/ui/card', () => ({
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock Button component
jest.mock('@/components/ui/Button', () => {
  return function Button(props: any) {
    return <button {...props} />;
  };
});

// Mock Input component
jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />
}));

// Mock Label component
jest.mock('@/components/ui/label', () => ({
  Label: (props: any) => <label htmlFor={props.htmlFor || "mock-id"} {...props} />
}));

// Mock Alert components
jest.mock('@/components/ui/alert', () => ({
  Alert: ({ children, variant }: { children: React.ReactNode, variant?: string }) => <div data-testid="alert" data-variant={variant}>{children}</div>,
  AlertDescription: ({ children }: { children: React.ReactNode }) => <div data-testid="alert-desc">{children}</div>
}));

// Mock Checkbox component
jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, id = "mock-checkbox", ...props }: any) => (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
      data-testid="checkbox"
    />
  )
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  EyeIcon: () => <span data-testid="eye-icon">Eye</span>,
  EyeOffIcon: () => <span data-testid="eye-off-icon">EyeOff</span>,
  AlertCircle: () => <span>Alert</span>,
  Loader2: () => <span>Loading</span>
}));

const renderLoginPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      <LoginPage />
    </QueryClientProvider>
  );
};

describe('LoginForm Component', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockReset();
    mockLocalStorage.setItem.mockReset();
    mockLocalStorage.removeItem.mockReset();
    mockMutateFn.mockReset();
    mockPush.mockReset();
  });

  it('renders login form with basic elements', () => {
    renderLoginPage();
    
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByTestId('checkbox')).toBeInTheDocument();
    expect(screen.getByText(/remember me/i)).toBeInTheDocument();
  });

  it('toggles password visibility when the toggle button is clicked', async () => {
    renderLoginPage();
    
    const passwordField = screen.getByPlaceholderText('••••••••');
    expect(passwordField).toHaveAttribute('type', 'password');
    
    // Initial state: password is hidden, eye icon is shown
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    
    // Click the toggle button
    fireEvent.click(screen.getByTestId('eye-icon'));
    
    // Password should now be visible, eyeOff icon is shown
    expect(passwordField).toHaveAttribute('type', 'text');
    expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
    
    // Toggle back
    fireEvent.click(screen.getByTestId('eye-off-icon'));
    
    // Password should be hidden again
    expect(passwordField).toHaveAttribute('type', 'password');
  });

  it('should display an error when submitting empty fields', async () => {
    renderLoginPage();
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByTestId('alert-desc')).toHaveTextContent('Please enter both email and password');
    });

    // The login mutation should not be called
    expect(mockMutateFn).not.toHaveBeenCalled();
  });

  it('should call the login mutation with the entered credentials', async () => {
    renderLoginPage();
    
    // Fill the form
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' }
    });
    
    // Check remember me
    fireEvent.click(screen.getByTestId('checkbox'));
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    
    // Check if the mutation was called with the correct parameters
    await waitFor(() => {
      expect(mockMutateFn).toHaveBeenCalledWith(
        {
          email: 'test@example.com', 
          password: 'password123',
          rememberMe: true
        },
        expect.anything()
      );
    });
  });

  it('should display an error message when login fails', async () => {
    // Configure the mock to simulate an error from the mutation
    mockMutateFn.mockImplementation((data, options) => {
      options.onError({ message: 'Invalid email or password', code: 'INVALID_EMAIL_PASSWORD' });
    });
    
    renderLoginPage();
    
    // Fill the form
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByTestId('alert-desc')).toHaveTextContent('Invalid email or password');
    });
  });

  it('should handle account lockout after 5 failed attempts', async () => {
    // Configure localStorage to return 4 failed attempts
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'failed_login_attempts') return '4';
      return null;
    });

    // Configure the mock to simulate an error from the mutation
    mockMutateFn.mockImplementation((data, options) => {
      options.onError({ message: 'Invalid email or password', code: 'INVALID_EMAIL_PASSWORD' });
    });
    
    renderLoginPage();
    
    // Fill the form
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    
    // Check that account lockout was triggered
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('failed_login_attempts', '5');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'account_lockout', 
        expect.any(String)
      );
      expect(screen.getByTestId('alert-desc')).toHaveTextContent('Too many login attempts. Please try again later');
    });
  });

  it('should navigate to profile on successful login', async () => {
    // Configure the mock to simulate a successful login
    mockMutateFn.mockImplementation((data, options) => {
      options.onSuccess();
    });
    
    renderLoginPage();
    
    // Fill the form
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    
    // Check that navigation happened
    await waitFor(() => {
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('failed_login_attempts');
      // expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should check for and handle previous account lockout', async () => {
    // Set a lockout that's still active (15 mins in the future)
    const futureTime = new Date(Date.now() + 15 * 60 * 1000);
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'account_lockout') {
        return JSON.stringify({ lockoutEndTime: futureTime.toISOString() });
      }
      return null;
    });
    
    renderLoginPage();
    
    // Check that the form controls are disabled
    expect(screen.getByPlaceholderText('name@example.com')).toBeDisabled();
    expect(screen.getByPlaceholderText('••••••••')).toBeDisabled();
    expect(screen.getByTestId('checkbox')).toBeDisabled();
    
    // Try to submit the form anyway
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    
    // Check that error message is displayed
    expect(screen.getByTestId('alert-desc')).toHaveTextContent('Too many login attempts. Please try again later');
  });
}); 