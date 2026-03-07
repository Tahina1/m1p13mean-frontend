import { Pagination } from '@/components/shared/components/pagination/pagination';
import { ShopService } from '@/components/shared/services/shop-service';
import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shops',
  imports: [Pagination],
  templateUrl: './shops.html',
  styleUrl: './shops.scss',
})
export class Shops {
  shops = signal<any[]>([]);
  loading = signal(true);
  page = signal(1);
  totalPages = signal(1);
  searchName = signal('');

  private readonly shopService = inject(ShopService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      this.searchName();
      this.page.set(1);
      this.loadShops();
    });
  }

  ngOnInit() {
    this.loadShops();
  }

  loadShops() {
    this.loading.set(true);
    this.shopService
      .getShops(this.page(), 12, {
        name: this.searchName(),
        status: 'ACTIVE',
      })
      .subscribe({
        next: (res: any) => {
          this.shops.set(res.shops);
          this.totalPages.set(res.pagination.totalPages);
        },
        error: () => this.loading.set(false),
        complete: () => this.loading.set(false),
      });
  }

  onPageChange(p: number) {
    this.page.set(p);
    this.loadShops();
  }

  openShop(shopId: string) {
    this.router.navigate(['/shops', shopId]);
  }

  resetFilters() {
    this.searchName.set('');
  }
}
