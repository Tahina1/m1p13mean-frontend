import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, finalize } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '@domain/common';
import { AuthStore } from '@infrastructure/stores/auth.store';
import { apiRoutes } from '@infrastructure/api/api.routes';

/**
 * Logout command.
 * Handles user logout.
 */
@Injectable({
  providedIn: 'root',
})
export class LogoutCommand {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  /**
   * Execute logout.
   */
  execute(): Observable<IApiResponse<void>> {
    this.authStore.setLoading(true);

    return this.http.post<IApiResponse<void>>(apiRoutes.auth.logout(), {}).pipe(
      tap(() => {
        this.authStore.clearAuth();
        this.router.navigate(['/auth/login']);
      }),
      catchError(() => {
        // Even if API call fails, clear local auth state
        this.authStore.clearAuth();
        this.router.navigate(['/auth/login']);
        return of({ status: 'success' as const, message: 'Logged out' });
      }),
      finalize(() => {
        this.authStore.setLoading(false);
      })
    );
  }
}
