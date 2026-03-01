import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShopService } from '@/components/shared/services/shop-service';
import { AuthService } from '@/components/shared/services/auth';

@Component({
  selector: 'app-create-shop-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-shop-modal.html',
  styleUrl: './create-shop-modal.scss',
})
export class CreateShopModal {
  private shopService = inject(ShopService);
  private authService = inject(AuthService);
  mode = signal<'create' | 'edit'>('create');
  editingShopId = '';

  isOpen = signal(false);

  name = '';
  category = '';
  floor = '';
  shopNumber = '';
  files: File[] = [];

  @Output() created = new EventEmitter<void>();

  open(shop?: any) {
    this.isOpen.set(true);

    if (shop) {
      // EDIT MODE
      this.mode.set('edit');
      this.editingShopId = shop._id;

      this.name = shop.name;
      this.category = shop.category;
      this.floor = shop.location?.floor || '';
      this.shopNumber = shop.location?.shopNumber || '';
    } else {
      // CREATE MODE
      this.mode.set('create');
      this.resetForm();
    }
  }

  resetForm() {
    this.name = '';
    this.category = '';
    this.floor = '';
    this.shopNumber = '';
    this.files = [];
    this.editingShopId = '';
  }

  close() {
    this.isOpen.set(false);
  }

  onFiles(e: any) {
    this.files = Array.from(e.target.files);
  }

  submit() {
    const user = this.authService.currentUser();
    if (!user) return;

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('category', this.category);
    formData.append('location[floor]', this.floor);
    formData.append('location[shopNumber]', this.shopNumber);

    this.files.forEach((file) => {
      formData.append('gallery', file);
    });

    // CREATE
    if (this.mode() === 'create') {
      formData.append('ownerId', user._id);

      this.shopService.createShop(formData).subscribe({
        next: () => {
          this.created.emit();
          this.close();
        },
        error: (err) => console.error(err),
      });
    }
    // EDIT
    else {
      this.shopService.updateShop(this.editingShopId, formData).subscribe({
        next: () => {
          this.created.emit();
          this.close();
        },
        error: (err) => console.error(err),
      });
    }
  }
}
