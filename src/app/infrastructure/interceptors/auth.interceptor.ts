import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthStore } from '@infrastructure/stores/auth.store';

/**
 * Authentication interceptor.
 * Adds authorization header and handles token refresh on 401 errors.
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Skip auth header for public routes
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];
  const isPublicRoute = publicRoutes.some((route) => req.url.includes(route));

  if (isPublicRoute) {
    return next(req);
  }

  // Add authorization header if token exists
  const accessToken = authStore.accessToken();
  if (accessToken) {
    req = addAuthHeader(req, accessToken);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh-token')) {
        return handleUnauthorized(req, next, authStore, router);
      }
      return throwError(() => error);
    })
  );
};

/**
 * Add authorization header to request.
 */
function addAuthHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Handle 401 unauthorized error by attempting token refresh.
 */
function handleUnauthorized(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authStore: AuthStore,
  router: Router
) {
  const refreshToken = authStore.refreshToken();

  if (!refreshToken) {
    authStore.clearAuth();
    router.navigate(['/auth/login']);
    return throwError(() => new Error('No refresh token available'));
  }

  return authStore.refreshTokens().pipe(
    switchMap((success) => {
      if (success) {
        const newToken = authStore.accessToken();
        if (newToken) {
          return next(addAuthHeader(req, newToken));
        }
      }
      authStore.clearAuth();
      router.navigate(['/auth/login']);
      return throwError(() => new Error('Token refresh failed'));
    }),
    catchError((error) => {
      authStore.clearAuth();
      router.navigate(['/auth/login']);
      return throwError(() => error);
    })
  );
}
