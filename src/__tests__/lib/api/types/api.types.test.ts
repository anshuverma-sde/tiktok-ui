import { ApiResponse } from '@/lib/api/types/api.types';

describe('API Types', () => {
  it('should define ApiResponse interface correctly', () => {
    // Create a successful response
    const successResponse: ApiResponse<string> = {
      success: true,
      data: 'Test data',
      message: 'Success message'
    };
    
    // Create an error response
    const errorResponse: ApiResponse = {
      success: false,
      message: 'Error message',
      errorCode: 'ERROR_CODE'
    };
    
    // Verify the structure
    expect(successResponse).toHaveProperty('success', true);
    expect(successResponse).toHaveProperty('data');
    expect(successResponse).toHaveProperty('message');
    
    expect(errorResponse).toHaveProperty('success', false);
    expect(errorResponse).toHaveProperty('message');
    expect(errorResponse).toHaveProperty('errorCode');
  });
}); 