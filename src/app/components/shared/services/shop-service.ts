import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from './http-request';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private readonly http = inject(HttpRequestService);

  createShop(data: FormData) {
    return this.http.post('api/shops', data);
  }

  // getShops(page: number = 1, limit: number = 10): Observable<any> {
  //   return this.http.get(`api/shops?page=${page}&limit=${limit}`);
  // }

  getShops(
    page: number = 1,
    limit: number = 10,
    filters?: {
      name?: string;
      category?: string;
      status?: string;
    }
  ): Observable<any> {
    let url = `api/shops?page=${page}&limit=${limit}`;

    if (filters?.name) {
      url += `&name=${encodeURIComponent(filters.name)}`;
    }

    if (filters?.category) {
      url += `&category=${encodeURIComponent(filters.category)}`;
    }

    if (filters?.status && filters.status !== 'all') {
      url += `&status=${filters.status}`;
    }

    return this.http.get(url);
  }

  deleteShop(id: string): Observable<any> {
    return this.http.delete(`api/shops/${id}`);
  }

  getShopById(id: string): Observable<any> {
    return this.http.get(`api/shops/${id}`);
  }

  updateShop(id: string, data: FormData) {
    return this.http.patch(`api/shops/${id}`, data);
  }

  updateShopStatus(id: string, status: string) {
    return this.http.patch(`api/shops/${id}/status`, { status });
  }
}
