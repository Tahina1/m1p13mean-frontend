import { Component, inject, signal } from '@angular/core';
import { ProductModal } from './product-modal/product-modal';
import { AuthService } from '@/components/shared/services/auth';
import { ShopService } from '@/components/shared/services/shop-service';

@Component({
  selector: 'app-shop-layout',
  imports: [ProductModal],
  templateUrl: './shop-layout.html',
  styleUrl: './shop-layout.scss',
})
export class ShopLayout {
  authService = inject(AuthService);
  shopService = inject(ShopService);
  isModalOpen = false;

  shop = signal<any>(null);

  ngOnInit() {
    const shopId = this.authService.shopId();

    console.log('MY SHOP ID =', shopId);

    if (!shopId) {
      console.error('No shop linked');
      return;
    }

    this.shopService.getShopById(shopId).subscribe((res) => {
      this.shop.set(res);
      console.log('MY SHOP =', res);
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
