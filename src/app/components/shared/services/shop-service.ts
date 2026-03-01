import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from './http-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private readonly http = inject(HttpRequestService);

  createShop(data: FormData) {
    return this.http.post('api/shops', data);
  }

  getShops(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`api/shops?page=${page}&limit=${limit}`);
  }

  deleteShop(id: string): Observable<any> {
    return this.http.delete(`api/shops/${id}`);
  }

  getShopById(id: string): Observable<any> {
    return this.http.get(`api/shops/${id}`);
  }

  updateShop(id: string, data: any): Observable<any> {
    return this.http.patch(`api/shops/${id}`, data);
  }
}
