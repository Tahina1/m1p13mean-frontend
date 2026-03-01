import { inject, Injectable, signal } from '@angular/core';
import { HttpRequestService } from './http-request';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpRequestService);
  cartCount = signal(0);
  cartUpdated$ = new Subject<void>();

  notifyCartUpdated() {
    this.cartUpdated$.next();
  }
  addToCart(productId: string) {
    return this.http.post('api/cart/items', { productId });
  }

  getCart() {
    return this.http.get('api/cart');
  }

  refreshCartCount() {
    this.getCart().subscribe((res: any) => {
      this.cartCount.set(res.cart.items?.length);
    });
  }

  updateQuantity(productId: string, quantity: number) {
    return this.http.put(`api/cart/items/${productId}`, { quantity: quantity });
  }

  removeItem(productId: string) {
    return this.http.delete(`api/cart/items/${productId}`);
  }

  checkout() {
    return this.http.post('api/cart/checkout', {});
  }
}
