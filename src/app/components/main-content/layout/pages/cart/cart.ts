import { CartService } from '@/components/shared/services/cart-service';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  private cartService = inject(CartService);

  cart = signal<any>(null);
  loading = signal(true);
  totalAmount = 0;

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loading.set(true);

    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cart.set(res.cart);
        this.totalAmount = res.totalAmount;
      },
      complete: () => this.loading.set(false),
    });
  }

  increase(item: any) {
    this.cartService
      .updateQuantity(item.productId._id, item.quantity + 1)
      .subscribe(() => this.loadCart());
  }

  decrease(item: any) {
    if (item.quantity <= 1) return;

    this.cartService
      .updateQuantity(item.productId._id, item.quantity - 1)
      .subscribe(() => this.loadCart());
  }

  remove(productId: string) {
    this.cartService.removeItem(productId).subscribe(() => {
      this.cartService.refreshCartCount();
      this.loadCart();
    });
  }

  checkout() {
    this.cartService.checkout().subscribe(() => {
      alert('Commande validée 🛍️');
      this.loadCart();
    });
  }
}
