import { render } from '@testing-library/react';
import PlanPage from '@/app/(public)/plan/page';

// Mock the Plan component
jest.mock('@/components/screens/plan/page', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-plan-page">Plan Page Mock</div>
  };
});

describe('Plan Page', () => {
  it('renders the plan page', () => {
    const { getByTestId } = render(<PlanPage />);
    
    // Check that the plan page is rendered
    expect(getByTestId('mock-plan-page')).toBeInTheDocument();
  });
}); 