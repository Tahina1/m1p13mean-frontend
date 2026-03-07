import { Product } from '@/components/shared/models/product';
import { AuthService } from '@/components/shared/services/auth';
import { CartService } from '@/components/shared/services/cart-service';
import { ProductService } from '@/components/shared/services/product-service';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  product = signal<Product | null>(null);
  loading = signal(true);
  quantity = signal(1);
  selectedImage = signal<string>('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(id!).subscribe({
      next: (res: any) => {
        const raw = res?.product ?? res;
        const p: Product = {
          ...raw,
          categoryIds: raw.categories ?? raw.categoryIds ?? [],//p.categoryIds → undefined → erreur runtime → les éléments suivants ne s'affichent pas
          shopId: raw.shopId?._id ?? raw.shopId,
        };
        this.product.set(p);
        this.selectedImage.set(p.images[0] ?? '');
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load product:', err);
        this.loading.set(false);
      },
    });
  }

  selectImage(img: string) {
    this.selectedImage.set(img);
  }

  addToCart() {
    const p = this.product();
    if (!p) return;

    if (!this.authService.isLoggedIn()) {
      this.authService.setAuthPopup(true);
      return;
    }

    this.cartService.addToCart(p._id, this.quantity()).subscribe({
      next: () => {
        this.cartService.refreshCartCount();
        this.cartService.notifyCartUpdated();
      },
      error: (err) => {
        alert(err?.error?.message || 'Erreur panier');
      },
    });
  }

  increase() {
    this.quantity.update((q) => q + 1);
  }

  decrease() {
    this.quantity.update((q) => (q > 1 ? q - 1 : 1));
  }
}
