import { Observable } from 'rxjs';
import { IApiResponse } from '@domain/common';
import {
  ILoginCredentials,
  IRegisterDto,
  IAuthResponse,
  IRefreshTokenResponse,
  IForgotPasswordDto,
  IResetPasswordDto,
} from './auth.interface';

/**
 * Authentication service interface.
 * Defines the contract for authentication operations.
 */
export interface IAuthService {
  /**
   * Login with credentials.
   */
  login(credentials: ILoginCredentials): Observable<IApiResponse<IAuthResponse>>;

  /**
   * Register a new user.
   */
  register(data: IRegisterDto): Observable<IApiResponse<IAuthResponse>>;

  /**
   * Logout the current user.
   */
  logout(): Observable<IApiResponse<void>>;

  /**
   * Refresh access token.
   */
  refreshToken(refreshToken: string): Observable<IApiResponse<IRefreshTokenResponse>>;

  /**
   * Request password reset.
   */
  forgotPassword(data: IForgotPasswordDto): Observable<IApiResponse<void>>;

  /**
   * Reset password with token.
   */
  resetPassword(data: IResetPasswordDto): Observable<IApiResponse<void>>;

  /**
   * Verify email with token.
   */
  verifyEmail(token: string): Observable<IApiResponse<void>>;
}
