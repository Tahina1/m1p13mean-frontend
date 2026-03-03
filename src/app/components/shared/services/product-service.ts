import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from './http-request';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpRequestService);

  createProduct(data: FormData): Observable<Product> {
    return this.http.post('api/products', data);
  }

  getShopProducts(shopId: string): Observable<Product[]> {
    return this.http.get(`api/products/shop/${shopId}`);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get(`api/products`);
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
}
