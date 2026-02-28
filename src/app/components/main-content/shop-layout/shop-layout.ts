import { Component } from '@angular/core';
import { ProductModal } from './product-modal/product-modal';

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
}
