import { Observable } from 'rxjs';
import { IApiResponse, IPaginationParams } from '@domain/common';
import { IUser, ICreateUserDto, IUpdateUserDto } from './user.interface';

/**
 * User service interface.
 * Defines the contract for user-related operations.
 */
export interface IUserService {
  /**
   * Get current authenticated user.
   */
  getCurrentUser(): Observable<IApiResponse<IUser>>;

  /**
   * Get user by ID.
   */
  getUserById(id: string): Observable<IApiResponse<IUser>>;

  /**
   * Get paginated list of users.
   */
  getUsers(params?: IPaginationParams): Observable<IApiResponse<IUser[]>>;

  /**
   * Create a new user.
   */
  createUser(data: ICreateUserDto): Observable<IApiResponse<IUser>>;

  /**
   * Update an existing user.
   */
  updateUser(id: string, data: IUpdateUserDto): Observable<IApiResponse<IUser>>;

  /**
   * Delete a user.
   */
  deleteUser(id: string): Observable<IApiResponse<void>>;
}
