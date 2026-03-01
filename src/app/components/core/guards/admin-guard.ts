import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    router.navigate(['/']);
    return false;
  }

  const role = user.roles?.[0];

  if (role !== 'ADMIN') {
    router.navigate(['/']);
    return false;
  }

  return true;
};
