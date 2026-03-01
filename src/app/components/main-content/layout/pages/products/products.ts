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
}
