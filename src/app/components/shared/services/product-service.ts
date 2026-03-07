import { inject, Injectable, signal } from '@angular/core';
import { HttpRequestService } from './http-request';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Pagination } from '../models/pagination';

interface ProductApiResponse {
  products: Product[];
  pagination: Pagination;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  isOpen = signal(false);
  selectedProduct = signal<Product | null>(null);

  open(product: Product) {
    this.selectedProduct.set(product);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.selectedProduct.set(null);
  }
  private http = inject(HttpRequestService);

  createProduct(data: FormData): Observable<Product> {
    return this.http.post('api/products', data);
  }

  getShopProducts(shopId: string): Observable<Product[]> {
    return this.http.get(`api/products/shop/${shopId}`);
  }

  getAllProducts(page: number = 1, limit: number = 5) {
    return this.http.get<ProductApiResponse>(`api/products?page=${page}&limit=${limit}`);
  }

  deleteProduct(id: string) {
    return this.http.delete(`api/products/${id}`);
  }

  updateProduct(id: string, data: FormData) {
    return this.http.patch(`api/products/${id}`, data);
  }

  getProductsByShop(shopId: string, page = 1, limit = 5) {
    return this.http.get(`api/products?shopId=${shopId}&page=${page}&limit=${limit}`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`api/products/${id}`);
  }

  searchProducts(params: {
    name?: string;
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }): Observable<ProductApiResponse> {
    const parts: string[] = [
      `page=${params.page ?? 1}`,
      `limit=${params.limit ?? 12}`,
    ];
    if (params.name) parts.push(`name=${encodeURIComponent(params.name)}`);
    params.categoryIds?.forEach((id) => parts.push(`categoryIds=${id}`));
    if (params.minPrice != null) parts.push(`minPrice=${params.minPrice}`);
    if (params.maxPrice != null) parts.push(`maxPrice=${params.maxPrice}`);
    return this.http.get<ProductApiResponse>(`api/products?${parts.join('&')}`);
  }
}
