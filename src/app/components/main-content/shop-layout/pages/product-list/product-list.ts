import { AuthService } from '@/components/shared/services/auth';
import { ProductService } from '@/components/shared/services/product-service';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private productService = inject(ProductService);
  private authService = inject(AuthService);

  products = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    const shopId = this.authService.shopId();

    if (!shopId) return;

    this.productService.getProductsByShop(shopId).subscribe((res: any) => {
      this.products.set(res.products);
      this.loading.set(false);
    });
  }

  deleteProduct(id: string) {
    if (!confirm('Supprimer ce produit ?')) return;

    this.productService.deleteProduct(id).subscribe(() => {
      this.products.set(this.products().filter((p) => p._id !== id));
    });
  }
}
