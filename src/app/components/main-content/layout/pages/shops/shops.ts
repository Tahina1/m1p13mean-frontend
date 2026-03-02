import { ShopService } from '@/components/shared/services/shop-service';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shops',
  imports: [],
  templateUrl: './shops.html',
  styleUrl: './shops.scss',
})
export class Shops {
  shops = signal<any[]>([]);
  loading = signal(true);
  shopService = inject(ShopService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.shopService.getShops().subscribe((res: any) => {
      console.log(res);

      const activeShops = res.shops.filter((s: any) => s.status === 'ACTIVE');
      this.shops.set(activeShops);
      this.loading.set(false);
    });
  }

  openShop(shopId: string) {
    this.router.navigate(['/shops', shopId]);
  }
}
