import { render } from '@testing-library/react';
import VerifyEmailPage from '@/app/(auth)/verify-email/page';

// Mock Box and CircularProgress components
jest.mock('@mui/material', () => ({
  Box: ({ children, sx }: { children: React.ReactNode, sx: any }) => 
    <div data-testid="mui-box">{children}</div>,
  CircularProgress: () => <div data-testid="mui-circular-progress">Loading...</div>
}));

// Mock verify-email component
jest.mock('@/components/screens/auth/verify-email', () => {
  return {
    __esModule: true,
    default: ({ emailToken }: { emailToken: string }) => 
      <div data-testid="mock-verify-email">Verify Email with token: {emailToken}</div>
  };
});

describe('Verify Email Page', () => {
  it('renders the verify email component with token from searchParams', () => {
    const { getByTestId, getByText } = render(
      <VerifyEmailPage searchParams={{ token: 'test-token' }} />
    );
    
    // Check that the verify email component is rendered with the token
    expect(getByTestId('mock-verify-email')).toBeInTheDocument();
    expect(getByText(/Verify Email with token: test-token/)).toBeInTheDocument();
  });

  it('renders the verify email component with empty token if not provided', () => {
    const { getByTestId } = render(
      <VerifyEmailPage searchParams={{}} />
    );
    
    // Check that the verify email component is rendered with empty token
    expect(getByTestId('mock-verify-email')).toBeInTheDocument();
    // Verify the component has empty token content
    const verifyComponent = getByTestId('mock-verify-email');
    expect(verifyComponent.textContent).toBe('Verify Email with token: ');
  });
}); 