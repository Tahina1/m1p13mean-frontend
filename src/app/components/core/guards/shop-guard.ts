import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const shopGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const user = localStorage.getItem('user');
  if (!user) {
    router.navigate(['/home']);
    return false;
  }

  const parsed = JSON.parse(user);
  const role = parsed.roles?.[0];

  if (role === 'SHOP') return true;

  router.navigate(['/home']);
  return false;
};
