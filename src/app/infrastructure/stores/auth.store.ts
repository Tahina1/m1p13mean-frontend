import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError, map } from 'rxjs';
import { IUser } from '@domain/users';
import { IAuthResponse, IRefreshTokenResponse } from '@domain/auth';
import { IApiResponse } from '@domain/common';
import { apiRoutes } from '@infrastructure/api/api.routes';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
};

/**
 * Authentication store using Angular Signals.
 * Manages authentication state and provides reactive access to auth data.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly http = inject(HttpClient);

  // State signals
  private readonly _user = signal<IUser | null>(this.loadUserFromStorage());
  private readonly _accessToken = signal<string | null>(this.loadFromStorage(STORAGE_KEYS.ACCESS_TOKEN));
  private readonly _refreshToken = signal<string | null>(this.loadFromStorage(STORAGE_KEYS.REFRESH_TOKEN));
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly user = this._user.asReadonly();
  readonly accessToken = this._accessToken.asReadonly();
  readonly refreshToken = this._refreshToken.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly isAuthenticated = computed(() => !!this._accessToken() && !!this._user());
  readonly userRoles = computed(() => this._user()?.roles ?? []);
  readonly displayName = computed(() => this._user()?.displayName ?? '');

  /**
   * Check if user has a specific role.
   */
  hasRole(role: string | string[]): boolean {
    const roles = this.userRoles();
    if (Array.isArray(role)) {
      return role.some((r) => roles.includes(r));
    }
    return roles.includes(role);
  }

  /**
   * Check if the access token is expired.
   */
  isTokenExpired(): boolean {
    const token = this._accessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }

  /**
   * Set authentication data after successful login.
   */
  setAuth(user: IUser, accessToken: string, refreshToken: string): void {
    this._user.set(user);
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);
    this._error.set(null);

    this.saveToStorage(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    this.saveToStorage(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    this.saveToStorage(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  /**
   * Update user data.
   */
  updateUser(userData: Partial<IUser>): void {
    const currentUser = this._user();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      this._user.set(updatedUser);
      this.saveToStorage(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }
  }

  /**
   * Clear all authentication data.
   */
  clearAuth(): void {
    this._user.set(null);
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._error.set(null);

    this.removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
    this.removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
    this.removeFromStorage(STORAGE_KEYS.USER);
  }

  /**
   * Set loading state.
   */
  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  /**
   * Set error message.
   */
  setError(error: string | null): void {
    this._error.set(error);
  }

  /**
   * Refresh access token.
   */
  refreshTokens(): Observable<boolean> {
    const refreshToken = this._refreshToken();
    if (!refreshToken) {
      return of(false);
    }

    return this.http
      .post<IApiResponse<IRefreshTokenResponse>>(apiRoutes.auth.refreshToken(), {
        refreshToken,
      })
      .pipe(
        tap((response) => {
          if (response.status === 'success' && response.data) {
            this._accessToken.set(response.data.accessToken);
            this._refreshToken.set(response.data.refreshToken);
            this.saveToStorage(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
            this.saveToStorage(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
          }
        }),
        map((response) => response.status === 'success'),
        catchError(() => of(false))
      );
  }

  // Storage helpers
  private loadFromStorage(key: string): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private loadUserFromStorage(): IUser | null {
    if (typeof window !== 'undefined') {
      const userJson = localStorage.getItem(STORAGE_KEYS.USER);
      if (userJson) {
        try {
          return JSON.parse(userJson);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  private saveToStorage(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  private removeFromStorage(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
}
