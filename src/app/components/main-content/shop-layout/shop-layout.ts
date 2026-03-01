import { Component, inject } from '@angular/core';
import { ProductModal } from './product-modal/product-modal';
import { AuthService } from '@/components/shared/services/auth';

@Component({
  selector: 'app-shop-layout',
  imports: [ProductModal],
  templateUrl: './shop-layout.html',
  styleUrl: './shop-layout.scss',
})
export class ShopLayout {
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  authService = inject(AuthService);
}
