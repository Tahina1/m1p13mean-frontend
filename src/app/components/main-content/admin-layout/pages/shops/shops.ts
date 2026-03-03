import { Shop } from '@/components/shared/models/shop';
import { ShopService } from '@/components/shared/services/shop-service';
import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { CreateShopModal } from './create-shop-modal/create-shop-modal';
import { Pagination } from '@/components/shared/components/pagination/pagination';

interface ShopApiResponse {
  shops: Shop[];
  pagination: Pagination;
}

@Component({
  selector: 'app-shops',
  imports: [CreateShopModal, Pagination],
  templateUrl: './shops.html',
  styleUrl: './shops.scss',
})
export class Shops {
  searchName = signal('');
  searchCategory = signal('');
  searchStatus = signal<'all' | 'ACTIVE' | 'PENDING' | 'SUSPENDED'>('all');
  private shopService = inject(ShopService);
  @ViewChild('shopModal') modal!: CreateShopModal;

  openCreateShop() {
    this.modal.open();
  }

  editShop(shop: Shop) {
    this.modal.open(shop);
  }

  shops = signal<Shop[]>([]);
  page = signal(1);
  totalPages = signal(1);
  loading = signal(false);

  constructor() {
    effect(() => {
      this.searchName();
      this.searchCategory();
      this.searchStatus();
      this.page.set(1);
      this.loadShops();
    });
  }

  ngOnInit() {
    this.loadShops();
  }

  // loadShops() {
  //   this.loading.set(true);

  //   this.shopService.getShops(this.page()).subscribe({
  //     next: (res: ShopApiResponse) => {
  //       this.shops.set(res.shops);
  //       this.totalPages.set(res.pagination.totalPages);
  //     },
  //     error: (err) => {
  //       console.error('Error loading shops', err);
  //     },
  //     complete: () => {
  //       this.loading.set(false);
  //     },
  //   });
  // }

  loadShops() {
    this.loading.set(true);

    this.shopService
      .getShops(this.page(), 10, {
        name: this.searchName(),
        category: this.searchCategory(),
        status: this.searchStatus(),
      })
      .subscribe({
        next: (res: ShopApiResponse) => {
          this.shops.set(res.shops);
          this.totalPages.set(res.pagination.totalPages);
        },
        error: (err) => console.error(err),
        complete: () => this.loading.set(false),
      });
  }

  onPageChange(p: number) {
    this.page.set(p);
    this.loadShops();
  }

  deleteShop(id: string) {
    if (!confirm('Delete this shop?')) return;

    this.shopService.deleteShop(id).subscribe(() => {
      this.loadShops();
    });
  }

  resetFilters() {
    this.searchName.set('');
    this.searchCategory.set('');
    this.searchStatus.set('all');
  }
}
