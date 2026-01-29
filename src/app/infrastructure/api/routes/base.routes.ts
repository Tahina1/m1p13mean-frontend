import { environment } from '@env';

/**
 * Creates a full API URL from a path.
 */
export const createApiUrl = (path: string): string => {
  return `${environment.apiUrl}${path}`;
};

/**
 * Creates a base URL without the /api prefix.
 */
export const createBaseUrl = (path: string): string => {
  const baseUrl = environment.apiUrl.replace('/api', '');
  return `${baseUrl}${path}`;
};
