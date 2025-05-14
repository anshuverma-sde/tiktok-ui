import { render } from '@testing-library/react';
import AuthLayout from '@/app/(auth)/layout';

describe('Auth Layout', () => {
  it('renders children without wrapping elements', () => {
    const { getByText } = render(
      <AuthLayout>
        <div>Test Child Content</div>
      </AuthLayout>
    );
    
    // Check that the children content is rendered directly
    expect(getByText('Test Child Content')).toBeInTheDocument();
  });
}); 