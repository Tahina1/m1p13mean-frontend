import { Injectable, inject } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser } from '@domain/users';
import { IApiResponse } from '@domain/common';
import { AuthStore } from '@infrastructure/stores/auth.store';
import { apiRoutes } from '@infrastructure/api/api.routes';

/**
 * Get current user query.
 * Fetches the authenticated user's profile.
 */
@Injectable({
  providedIn: 'root',
})
export class GetCurrentUserQuery {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);

  /**
   * Execute the query.
   */
  execute(): Observable<IApiResponse<IUser>> {
    return this.http.get<IApiResponse<IUser>>(apiRoutes.users.getCurrentUser()).pipe(
      tap((response) => {
        if (response.status === 'success' && response.data) {
          this.authStore.updateUser(response.data);
        }
      }),
      catchError((error) => {
        console.error('Failed to fetch current user:', error);
        return throwError(() => error);
      })
    );
  }
}
