import { AuthService } from '@/components/shared/services/auth';
import { ProductService } from '@/components/shared/services/product-service';
import { ShopService } from '@/components/shared/services/shop-service';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductModal } from '../product-modal/product-modal';
import { OrderService } from '@/components/shared/services/order-service';
import { EditShopModal } from '../edit-shop-modal/edit-shop-modal';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, ProductModal, EditShopModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  authService = inject(AuthService);
  shopService = inject(ShopService);
  productService = inject(ProductService);
  orderService = inject(OrderService);
  isModalOpen = false;
  isShopModalOpen = false;
  shopId: string | null = '';
  totalProducts: number = 0;
  orderNumber = 0;

  shop = signal<any>(null);
  @ViewChild(EditShopModal) editShopModal!: EditShopModal;

  ngOnInit() {
    this.shopId = this.authService.shopId();

    if (!this.shopId) {
      console.error('No shop linked');
      return;
    }

    this.shopService.getShopById(this.shopId).subscribe((res) => {
      this.shop.set(res);
    });

    this.productService.getProductsByShop(this.shopId).subscribe({
      next: (res: any) => {
        this.totalProducts = res.products?.length;
      },
    });

    this.orderService.getShopOrderById().subscribe((res: any) => {
      this.orderNumber = res.total;
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openShopModal() {
    const currentShop = this.shop();

    if (!currentShop) {
      console.error('No shop loaded');
      return;
    }

    this.editShopModal.open(currentShop);
  }

  closeShopModal() {
    this.isShopModalOpen = false;
  }
}
