export class ApiResponse<T> {
  meta: {
    statusCode: number;
    message: string;
    timestamp: Date;
    pagination?: {
      page?: number;
      limit?: number;
      totalPage?: number;
      totalData?: number;
    };
  };
  data: T;

  constructor(
    statusCode: number,
    message: string,
    timestamp: Date,
    data: T,
    pagination?: {
      page?: number;
      limit?: number;
      totalPage?: number;
      totalData?: number;
    },
    meta?: any,
  ) {
    this.meta = {
      statusCode,
      timestamp,
      message,
      ...(pagination ? { pagination } : {}),
      ...meta,
    };
    this.data = data;
  }
}
