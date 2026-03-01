export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[]; // ['ADMIN'] | ['SHOP'] | ['CLIENT']
  shopId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
