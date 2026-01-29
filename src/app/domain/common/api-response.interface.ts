/**
 * Standard API response wrapper interface.
 * All API responses should follow this structure.
 */
export interface IApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  pagination?: IPaginationInfo;
}

/**
 * Pagination information for list responses.
 */
export interface IPaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Query parameters for paginated requests.
 */
export interface IPaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
