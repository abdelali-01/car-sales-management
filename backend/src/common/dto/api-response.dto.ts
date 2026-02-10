export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponseDto<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: PaginationMeta;

  constructor(
    success: boolean,
    data?: T,
    message?: string,
    meta?: PaginationMeta,
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.meta = meta;
  }

  static success<T>(
    data: T,
    message?: string,
    meta?: PaginationMeta,
  ): ApiResponseDto<T> {
    return new ApiResponseDto(true, data, message, meta);
  }

  static error(message: string): ApiResponseDto<null> {
    return new ApiResponseDto(false, null, message);
  }
}
