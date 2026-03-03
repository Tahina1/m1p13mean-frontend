import { Product } from '@/components/shared/models/product';
import { AuthService } from '@/components/shared/services/auth';
import { CartService } from '@/components/shared/services/cart-service';
import { ProductService } from '@/components/shared/services/product-service';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  private cartService = inject(CartService);
  private authService = inject(AuthService);

  products = signal<Product[]>([]);
  loading = signal(true);
  shopName = signal('Boutique');
  quantities = signal<Record<string, number>>({});

  ngOnInit() {
    const shopId = this.route.snapshot.paramMap.get('id');
    if (!shopId) return;

    this.productService.getProductsByShop(shopId).subscribe((res: any) => {
      this.products.set(res.products);
      this.loading.set(false);

      const q: Record<string, number> = {};
      res.products.forEach((p: any) => (q[p._id] = 1));
      this.quantities.set(q);
    });
  }

  addToCart(productId: string) {
    if (!this.authService.isLoggedIn()) {
      this.authService.setAuthPopup(true);
      return;
    }

    const qty = this.quantities()[productId] || 1;

    this.cartService.addToCart(productId, qty).subscribe({
      next: () => {
        this.cartService.refreshCartCount();
        this.cartService.notifyCartUpdated();
      },
      error: (err) => {
        alert(err?.error?.message || 'Erreur panier');
      },
    });
  }

  increase(pId: string) {
    this.quantities.update((q) => {
      q[pId]++;
      return { ...q };
    });
  }

  decrease(pId: string) {
    this.quantities.update((q) => {
      if (q[pId] > 1) q[pId]--;
      return { ...q };
    });
  }
}
