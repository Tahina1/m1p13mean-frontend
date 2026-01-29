import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthStore } from '@infrastructure/stores/auth.store';

/**
 * Role guard factory.
 * Creates a guard that checks if user has required roles.
 *
 * Usage in routes:
 * {
 *   path: 'admin',
 *   canActivate: [roleGuard],
 *   data: { roles: ['admin'] }
 * }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (!authStore.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const hasRole = authStore.hasRole(requiredRoles);

  if (!hasRole) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
