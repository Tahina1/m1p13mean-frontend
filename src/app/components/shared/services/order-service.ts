import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from './http-request';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpRequestService);

  getShopOrders() {
    return this.http.get('api/orders/shop');
  }

  getShopOrderById(page = 1) {
    return this.http.get(`api/orders/shop/?page=${page}`);
  }

  getClientOrderById(page = 1) {
    return this.http.get(`api/orders/me/?page=${page}`);
  }

  updateShopOrder(id: string, status: string) {
    return this.http.patch(`api/orders/shop/${id}`, { status });
  }

  getMyOrders() {
    return this.http.get('api/orders/me');
  }
}
