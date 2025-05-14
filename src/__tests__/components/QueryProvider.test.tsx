import { render } from '@testing-library/react';
import QueryProvider from '@/components/QueryProvider';

// Mock the queryClient
jest.mock('@/lib/queryClient', () => ({
  queryClient: {
    /* Mock minimal required properties */
  }
}));

jest.mock('@tanstack/react-query', () => ({
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-query-client-provider">{children}</div>
  ),
}));

describe('QueryProvider', () => {
  it('renders children within QueryClientProvider', () => {
    const { getByTestId, getByText } = render(
      <QueryProvider>
        <div>Test Child</div>
      </QueryProvider>
    );

    // Check that QueryClientProvider is rendered
    expect(getByTestId('mock-query-client-provider')).toBeInTheDocument();
    
    // Check that children are rendered
    expect(getByText('Test Child')).toBeInTheDocument();
  });
}); 