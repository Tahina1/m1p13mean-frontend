import { createApiUrl, createBaseUrl } from './base.routes';

/**
 * Authentication API routes.
 */
export const authRoutes = {
  login: () => createApiUrl('/auth/login'),
  register: () => createApiUrl('/auth/register'),
  logout: () => createBaseUrl('/auth/logout'),
  refreshToken: () => createBaseUrl('/auth/refresh-token'),
  forgotPassword: () => createApiUrl('/auth/forgot-password'),
  resetPassword: () => createApiUrl('/auth/reset-password'),
  verifyEmail: () => createApiUrl('/auth/verify-email'),
};
