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
        // Store the error handler for use in our mock
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

// Disable actual HTTP requests
jest.mock('http');
jest.mock('https');

export { mockAxiosInstance }; 