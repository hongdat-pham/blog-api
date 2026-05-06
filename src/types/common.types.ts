export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export type ServiceResult<T> = {
  data: T | null;
  error: string | null;
};
