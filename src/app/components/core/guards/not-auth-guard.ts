import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const notAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (localStorage.getItem('authorization')) {
    router.navigate(['dashboard']);
    return false;
  }
  return true;
};
