export interface ApiResult {
  desc: string;
  code: string;
}

export interface ApiResponse<T> {
  result: ApiResult;
  data: T;
}
