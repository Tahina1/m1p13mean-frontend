import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IUser } from '@domain/users';
import { IApiResponse, IPaginationParams } from '@domain/common';
import { apiRoutes } from '@infrastructure/api/api.routes';

/**
 * Get users query.
 * Fetches a paginated list of users.
 */
@Injectable({
  providedIn: 'root',
})
export class GetUsersQuery {
  private readonly http = inject(HttpClient);

  /**
   * Execute the query with optional pagination parameters.
   */
  execute(params?: IPaginationParams): Observable<IApiResponse<IUser[]>> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    }

    return this.http
      .get<IApiResponse<IUser[]>>(apiRoutes.users.getUsers(), { params: httpParams })
      .pipe(
        catchError((error) => {
          console.error('Failed to fetch users:', error);
          return throwError(() => error);
        })
      );
  }
}
