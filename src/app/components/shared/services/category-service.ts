import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from './http-request';
import { Observable } from 'rxjs';
import { Product, ProductCategory } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpRequestService);

  createProductCategory(name: string): Observable<ProductCategory> {
    return this.http.post('api/product-categories', { name });
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get('api/product-categories');
  }

  getCategoryById(id: string): Observable<ProductCategory> {
    return this.http.get(`api/product-categories/${id}`);
  }

  deleteProduct(id: string) {
    return this.http.delete(`api/product-categories/${id}`);
  }

  updateProduct(id: string, name: string) {
    return this.http.patch(`api/product-categories/${id}`, { name });
  }
}
