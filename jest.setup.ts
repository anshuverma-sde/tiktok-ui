import '@testing-library/jest-dom';

// Mock for axios
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: {
      use: jest.fn((successFn, errorFn) => {
        return () => {};
      }),
    },
  },
  defaults: {
    headers: {
      common: {}
    }
  }
};

jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
  isAxiosError: jest.fn(() => true),
  defaults: {
    headers: {
      common: {}
    }
  }
}));

// Mock the axiosInstance directly
jest.mock('./src/lib/api/axiosInstance', () => mockAxiosInstance, { virtual: true });

// Disable actual HTTP requests
jest.mock('http');
jest.mock('https');

// Mock ResizeObserver
class ResizeObserverMock {
  // These methods need to exist but don't need to do anything in the test environment
  observe() {
    // Method intentionally left empty for testing purposes
    // In a real environment, this would track an element's size changes
  }
  
  unobserve() {
    // Method intentionally left empty for testing purposes
    // In a real environment, this would stop tracking an element's size changes
  }
  
  disconnect() {
    // Method intentionally left empty for testing purposes
    // In a real environment, this would disconnect the observer from all targets
  }
}

global.ResizeObserver = ResizeObserverMock;

// Export for use in tests
(global as any).mockAxiosInstance = mockAxiosInstance;
