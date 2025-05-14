import { queryClient } from '@/lib/queryClient';

describe('QueryClient', () => {
  it('should be properly configured', () => {
    // Test that the queryClient has been created with the expected configuration
    expect(queryClient).toBeDefined();
    
    // Check default options
    const defaultOptions = queryClient.getDefaultOptions();
    
    // Check queries configuration
    expect(defaultOptions.queries).toBeDefined();
    expect(defaultOptions.queries?.retry).toBe(1);
    expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
  });

  it('should have a working query cache', () => {
    // Set up a test query
    const testData = { test: 'data' };
    const queryKey = ['test-query'];
    
    // Set the query data
    queryClient.setQueryData(queryKey, testData);
    
    // Verify that we can retrieve the data
    expect(queryClient.getQueryData(queryKey)).toEqual(testData);
    
    // Clear the query cache for cleanup
    queryClient.removeQueries({ queryKey });
  });

  it('should have proper default behaviors', () => {
    // Test the query client's default behaviors
    expect(queryClient.isFetching()).toBe(0); // No fetches in progress
    expect(queryClient.getQueriesData({})).toEqual([]); // No queries initially
  });
}); 