import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';

/**
 * Centralized API routes aggregator.
 * All API routes should be accessed through this object.
 */
export const apiRoutes = {
  auth: authRoutes,
  users: userRoutes,
};
