import { AuthService } from '@/components/shared/services/auth';
import { CartService } from '@/components/shared/services/cart-service';
import { ProductService } from '@/components/shared/services/product-service';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  private cartService = inject(CartService);
  private authService = inject(AuthService);

  products = signal<any[]>([]);
  loading = signal(true);
  shopName = signal('Boutique');

  ngOnInit() {
    const shopId = this.route.snapshot.paramMap.get('id');
    if (!shopId) return;

    this.productService.getProductsByShop(shopId).subscribe((res: any) => {
      this.products.set(res.products);
      this.loading.set(false);
    });
  }

  addToCart(productId: string) {
    if (!this.authService.isLoggedIn()) {
      // 🔥 Save pending product
      sessionStorage.setItem('pendingCartProduct', productId);

      this.authService.setAuthPopup(true);
      return;
    }

    this.cartService.addToCart(productId).subscribe(() => {
      this.cartService.refreshCartCount();
      this.cartService.notifyCartUpdated();
    });
  }
}
