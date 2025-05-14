import { render } from '@testing-library/react';
import ForgotPasswordPage from '@/app/(auth)/forgot-password/page';

// Mock ForgotPasswordForm component
jest.mock('@/components/screens/auth/ForgotPasswordForm', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-forgot-password-form">Forgot Password Form Mock</div>
  };
});

describe('Forgot Password Page', () => {
  it('renders the forgot password form', () => {
    const { getByTestId } = render(<ForgotPasswordPage />);
    
    // Check that the forgot password form is rendered
    expect(getByTestId('mock-forgot-password-form')).toBeInTheDocument();
  });
}); 