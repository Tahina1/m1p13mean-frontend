/**
 * User domain model interface.
 * Represents the core user entity in the system.
 */
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  roles: string[];
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

/**
 * User status enumeration.
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

/**
 * User creation DTO.
 */
export interface ICreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles?: string[];
}

/**
 * User update DTO.
 */
export interface IUpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: string[];
  status?: UserStatus;
}
