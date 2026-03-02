export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryIds: ProductCategory[];
  shopId: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  stock: number;
}

export interface ProductCategory {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
