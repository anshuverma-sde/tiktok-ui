import { useLoaderStore } from '@/stores/useLoaderStore';

describe('useLoaderStore', () => {
  // Clear the store before each test
  beforeEach(() => {
    useLoaderStore.setState({
      isLoading: false,
      message: undefined,
    });
  });

  it('should initialize with default values', () => {
    const state = useLoaderStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.message).toBeUndefined();
  });

  it('should show loader with message', () => {
    const { showLoader } = useLoaderStore.getState();
    
    // Test with message
    showLoader('Loading data...');
    
    const newState = useLoaderStore.getState();
    expect(newState.isLoading).toBe(true);
    expect(newState.message).toBe('Loading data...');
  });

  it('should show loader without message', () => {
    const { showLoader } = useLoaderStore.getState();
    
    // Test without message
    showLoader();
    
    const newState = useLoaderStore.getState();
    expect(newState.isLoading).toBe(true);
    expect(newState.message).toBeUndefined();
  });

  it('should hide loader', () => {
    const { showLoader, hideLoader } = useLoaderStore.getState();
    
    // First show loader
    showLoader('Loading data...');
    
    // Then hide it
    hideLoader();
    
    const newState = useLoaderStore.getState();
    expect(newState.isLoading).toBe(false);
    expect(newState.message).toBeUndefined();
  });

  it('should allow updating loader state multiple times', () => {
    const { showLoader, hideLoader } = useLoaderStore.getState();
    
    // First operation
    showLoader('Loading data...');
    
    // Second operation
    showLoader('Processing data...');
    
    // Check updated message
    let state = useLoaderStore.getState();
    expect(state.isLoading).toBe(true);
    expect(state.message).toBe('Processing data...');
    
    // Hide and show again
    hideLoader();
    showLoader('Finishing up...');
    
    state = useLoaderStore.getState();
    expect(state.isLoading).toBe(true);
    expect(state.message).toBe('Finishing up...');
  });
}); 