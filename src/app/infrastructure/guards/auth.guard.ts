import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '@infrastructure/stores/auth.store';

/**
 * Authentication guard.
 * Protects routes that require authentication.
 */
export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  const currentUrl = router.routerState.snapshot.url;
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: currentUrl },
  });

  return false;
};

/**
 * Guest guard.
 * Redirects authenticated users away from guest-only pages (like login).
 */
export const guestGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
