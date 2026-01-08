// API Response 응답 포맷 정의

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
