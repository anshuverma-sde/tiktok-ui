import { render } from '@testing-library/react';
import SignupPage from '@/app/(auth)/signup/page';

// Mock SignUpForm component
jest.mock('@/components/screens/auth/SignUpForm', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-signup-form">Signup Form Mock</div>
  };
});

describe('Signup Page', () => {
  it('renders the signup form', () => {
    const { getByTestId } = render(<SignupPage />);
    
    // Check that the signup form is rendered
    expect(getByTestId('mock-signup-form')).toBeInTheDocument();
  });
}); 