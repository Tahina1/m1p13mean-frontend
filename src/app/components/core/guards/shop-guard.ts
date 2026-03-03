import { AuthService } from '@/components/shared/services/auth';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const shopGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const user = authService.userSignal();
  const activeRole = authService.activeRole();

  if (!user) {
    router.navigate(['/']);
    return false;
  }

  const hasRole = user.roles?.includes('SHOP');
  const isActive = activeRole === 'SHOP';

  if (!hasRole || !isActive) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
