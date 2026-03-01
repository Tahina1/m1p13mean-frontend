import { Pagination } from '@/components/shared/models/pagination';
import { Shop } from '@/components/shared/models/shop';
import { ShopService } from '@/components/shared/services/shop-service';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { CreateShopModal } from './create-shop-modal/create-shop-modal';

interface ShopApiResponse {
  shops: Shop[];
  pagination: Pagination;
}

@Component({
  selector: 'app-shops',
  imports: [CreateShopModal],
  templateUrl: './shops.html',
  styleUrl: './shops.scss',
})
export class Shops {
  private shopService = inject(ShopService);
  @ViewChild('shopModal') modal!: CreateShopModal;

  openCreateShop() {
    this.modal.open();
  }

  shops = signal<Shop[]>([]);
  page = signal(1);
  totalPages = signal(1);
  loading = signal(false);

  ngOnInit() {
    this.loadShops();
  }

  loadShops() {
    this.loading.set(true);

    this.shopService.getShops(this.page()).subscribe({
      next: (res: ShopApiResponse) => {
        this.shops.set(res.shops);
        this.totalPages.set(res.pagination.totalPages);
      },
      error: (err) => {
        console.error('Error loading shops', err);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((v) => v + 1);
      this.loadShops();
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update((v) => v - 1);
      this.loadShops();
    }
  }

  deleteShop(id: string) {
    if (!confirm('Delete this shop?')) return;

    this.shopService.deleteShop(id).subscribe(() => {
      this.loadShops();
    });
  }
}
