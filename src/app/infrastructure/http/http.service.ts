import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * HTTP service wrapper for making API requests.
 * Provides a clean interface for HTTP operations.
 */
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly http = inject(HttpClient);

  /**
   * Perform a GET request.
   */
  get<T>(url: string, params?: Record<string, string | number | boolean>): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http.get<T>(url, { params: httpParams });
  }

  /**
   * Perform a POST request.
   */
  post<T>(url: string, body: unknown, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.post<T>(url, body, options);
  }

  /**
   * Perform a PUT request.
   */
  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(url, body);
  }

  /**
   * Perform a PATCH request.
   */
  patch<T>(url: string, body: unknown): Observable<T> {
    return this.http.patch<T>(url, body);
  }

  /**
   * Perform a DELETE request.
   */
  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }

  /**
   * Build HTTP params from a record.
   */
  private buildParams(params?: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return httpParams;
  }
}
