import axios from 'axios';

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
        mockAxiosInstance.errorHandler = errorFn;
        return () => {};
      }),
    },
  },
  errorHandler: null as any,
  defaults: {
    headers: {
      common: {}
    }
  }
};

// Mock axios.create to return our mockAxiosInstance
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
export default axios as jest.Mocked<typeof axios>; 