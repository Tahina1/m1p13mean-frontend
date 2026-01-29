import { Injectable, inject, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoginCredentials, IRegisterDto, IAuthResponse } from '@domain/auth';
import { IUser } from '@domain/users';
import { IApiResponse } from '@domain/common';
import { AuthStore } from '@infrastructure/stores/auth.store';
import { LoginCommand } from '@application/commands/auth/login.command';
import { RegisterCommand } from '@application/commands/auth/register.command';
import { LogoutCommand } from '@application/commands/auth/logout.command';
import { GetCurrentUserQuery } from '@application/queries/users/get-current-user.query';

/**
 * Authentication service facade.
 * Provides a unified interface for authentication operations.
 * Components should use this service instead of accessing commands/queries directly.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authStore = inject(AuthStore);
  private readonly loginCommand = inject(LoginCommand);
  private readonly registerCommand = inject(RegisterCommand);
  private readonly logoutCommand = inject(LogoutCommand);
  private readonly getCurrentUserQuery = inject(GetCurrentUserQuery);

  // Expose state as readonly signals
  readonly user = this.authStore.user;
  readonly isAuthenticated = this.authStore.isAuthenticated;
  readonly loading = this.authStore.loading;
  readonly error = this.authStore.error;
  readonly userRoles = this.authStore.userRoles;
  readonly displayName = this.authStore.displayName;

  /**
   * Login with credentials.
   */
  login(credentials: ILoginCredentials, redirectUrl?: string): Observable<IApiResponse<IAuthResponse>> {
    return this.loginCommand.execute(credentials, redirectUrl);
  }

  /**
   * Register a new user.
   */
  register(data: IRegisterDto): Observable<IApiResponse<IAuthResponse>> {
    return this.registerCommand.execute(data);
  }

  /**
   * Logout the current user.
   */
  logout(): Observable<IApiResponse<void>> {
    return this.logoutCommand.execute();
  }

  /**
   * Refresh current user data.
   */
  refreshCurrentUser(): Observable<IApiResponse<IUser>> {
    return this.getCurrentUserQuery.execute();
  }

  /**
   * Check if user has a specific role.
   */
  hasRole(role: string | string[]): boolean {
    return this.authStore.hasRole(role);
  }

  /**
   * Check if access token is expired.
   */
  isTokenExpired(): boolean {
    return this.authStore.isTokenExpired();
  }

  /**
   * Clear authentication error.
   */
  clearError(): void {
    this.authStore.setError(null);
  }
}
