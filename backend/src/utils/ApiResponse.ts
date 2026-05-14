export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ApiResponse<T = any> {
  constructor(
    public success: boolean,
    public message: string,
    public data?: T,
    public meta?: PaginationMeta,
    public errors?: any[],
  ) {}

  static ok<T>(message: string, data?: T, meta?: PaginationMeta): ApiResponse<T> {
    return new ApiResponse(true, message, data, meta);
  }

  static error(message: string, errors?: any[]): ApiResponse {
    return new ApiResponse(false, message, undefined, undefined, errors);
  }

  toJSON() {
    const response: any = {
      success: this.success,
      message: this.message,
    };

    if (this.data !== undefined) {
      response.data = this.data;
    }

    if (this.meta) {
      response.meta = this.meta;
    }

    if (this.errors && this.errors.length > 0) {
      response.errors = this.errors;
    }

    return response;
  }
}
