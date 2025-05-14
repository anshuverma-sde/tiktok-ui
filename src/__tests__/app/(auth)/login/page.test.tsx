import { render } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';

// Mock LoginForm component
jest.mock('@/components/screens/auth/LoginForm', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-login-form">Login Form Mock</div>
  };
});

describe('Login Page', () => {
  it('renders the login form', () => {
    const { getByTestId } = render(<LoginPage />);
    
    // Check that the login form is rendered
    expect(getByTestId('mock-login-form')).toBeInTheDocument();
  });
}); 