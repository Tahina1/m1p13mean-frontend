import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const shopGuard: CanActivateFn = () => {
  const router = inject(Router);

  const user = JSON.parse(sessionStorage.getItem('user') || 'null');

  if (!user) {
    router.navigate(['/']);
    return false;
  }

  const role = user.roles?.[0];

  if (role !== 'SHOP') {
    router.navigate(['/']);
    return false;
  }

  return true;
};
