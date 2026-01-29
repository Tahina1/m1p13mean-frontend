import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ILoginCredentials, IAuthResponse } from '@domain/auth';
import { IApiResponse } from '@domain/common';
import { AuthStore } from '@infrastructure/stores/auth.store';
import { apiRoutes } from '@infrastructure/api/api.routes';

/**
 * Login command.
 * Handles user authentication.
 */
@Injectable({
  providedIn: 'root',
})
export class LoginCommand {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  /**
   * Execute login with credentials.
   */
  execute(
    credentials: ILoginCredentials,
    redirectUrl?: string
  ): Observable<IApiResponse<IAuthResponse>> {
    this.authStore.setLoading(true);
    this.authStore.setError(null);

    return this.http.post<IApiResponse<IAuthResponse>>(apiRoutes.auth.login(), credentials).pipe(
      tap((response) => {
        if (response.status === 'success' && response.data) {
          const { user, accessToken, refreshToken } = response.data;
          this.authStore.setAuth(user, accessToken, refreshToken);

          // Navigate to return URL or dashboard
          const targetUrl = redirectUrl || '/dashboard';
          this.router.navigate([targetUrl]);
        }
      }),
      catchError((error) => {
        const message = error.message || 'Login failed. Please try again.';
        this.authStore.setError(message);
        return throwError(() => error);
      }),
      finalize(() => {
        this.authStore.setLoading(false);
      })
    );
  }
}
