// Generic reusable API response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  errorCode?: string;
}
