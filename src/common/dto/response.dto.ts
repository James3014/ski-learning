export class ApiResponse<T = any> {
  data?: T;
  message?: string;
  timestamp: string;

  constructor(data?: T, message?: string) {
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}

export class PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;

  constructor(data: T[], total: number) {
    super(data);
    this.total = total;
  }
}
