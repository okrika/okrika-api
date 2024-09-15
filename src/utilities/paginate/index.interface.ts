export interface PaginationResult<T> {
  totalCount: number;
  totalPages: number;
  list: T[];
}
