import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from './http-request';
import { Observable } from 'rxjs';
import { Product, ProductCategory } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpRequestService);

  createProductCategory(data: FormData): Observable<ProductCategory> {
    return this.http.post('api/product-categories', data);
  }

  getProductCategories(page = 1, limit = 5): Observable<ProductCategory[]> {
    return this.http.get(`api/product-categories`);
  }

  getCategoryById(id: string): Observable<ProductCategory> {
    return this.http.get(`api/product-categories/${id}`);
  }

  deleteProduct(id: string) {
    return this.http.delete(`api/product-categories/${id}`);
  }

  updateProduct(id: string, data: FormData) {
    return this.http.patch(`api/product-categories/${id}`, data);
  }
}
