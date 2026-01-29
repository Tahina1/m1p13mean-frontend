import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IRegisterDto, IAuthResponse } from '@domain/auth';
import { IApiResponse } from '@domain/common';
import { AuthStore } from '@infrastructure/stores/auth.store';
import { apiRoutes } from '@infrastructure/api/api.routes';

/**
 * Register command.
 * Handles new user registration.
 */
@Injectable({
  providedIn: 'root',
})
export class RegisterCommand {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  /**
   * Execute user registration.
   */
  execute(data: IRegisterDto): Observable<IApiResponse<IAuthResponse>> {
    this.authStore.setLoading(true);
    this.authStore.setError(null);

    return this.http.post<IApiResponse<IAuthResponse>>(apiRoutes.auth.register(), data).pipe(
      tap((response) => {
        if (response.status === 'success' && response.data) {
          const { user, accessToken, refreshToken } = response.data;
          this.authStore.setAuth(user, accessToken, refreshToken);
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError((error) => {
        const message = error.message || 'Registration failed. Please try again.';
        this.authStore.setError(message);
        return throwError(() => error);
      }),
      finalize(() => {
        this.authStore.setLoading(false);
      })
    );
  }
}
