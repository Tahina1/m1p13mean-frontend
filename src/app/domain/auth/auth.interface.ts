import { IUser } from '@domain/users';

/**
 * Login credentials DTO.
 */
export interface ILoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration DTO.
 */
export interface IRegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Authentication response.
 */
export interface IAuthResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Token refresh response.
 */
export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Password reset request DTO.
 */
export interface IForgotPasswordDto {
  email: string;
}

/**
 * Password reset DTO.
 */
export interface IResetPasswordDto {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * Token payload decoded from JWT.
 */
export interface ITokenPayload {
  sub: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}
