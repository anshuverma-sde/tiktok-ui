import { render } from '@testing-library/react';
import HomePage from '@/app/(public)/page';

// Mock the LandingPage component
jest.mock('@/components/screens/landingPage/landing-page', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-landing-page">Landing Page Mock</div>
  };
});

describe('Home Page', () => {
  it('renders the landing page', () => {
    const { getByTestId } = render(<HomePage />);
    
    // Check that the landing page is rendered
    expect(getByTestId('mock-landing-page')).toBeInTheDocument();
  });
}); 