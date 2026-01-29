import { createApiUrl } from './base.routes';

/**
 * User API routes.
 */
export const userRoutes = {
  getCurrentUser: () => createApiUrl('/users/me'),
  getUserById: (id: string) => createApiUrl(`/users/${id}`),
  getUsers: () => createApiUrl('/users'),
  createUser: () => createApiUrl('/users'),
  updateUser: (id: string) => createApiUrl(`/users/${id}`),
  deleteUser: (id: string) => createApiUrl(`/users/${id}`),
};
