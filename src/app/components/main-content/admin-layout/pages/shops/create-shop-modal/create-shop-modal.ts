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

  isOpen = signal(false);

  name = '';
  category = '';
  floor = '';
  shopNumber = '';
  files: File[] = [];

  @Output() created = new EventEmitter<void>();

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  onFiles(e: any) {
    this.files = Array.from(e.target.files);
  }

  submit() {
    const user = this.authService.currentUser(); // signal user
    if (!user) return;

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('category', this.category);
    formData.append('location[floor]', this.floor);
    formData.append('location[shopNumber]', this.shopNumber);
    formData.append('ownerId', user._id);

    this.files.forEach((file) => {
      formData.append('gallery', file);
    });

    this.shopService.createShop(formData).subscribe({
      next: () => {
        this.created.emit(); // reload table
        this.close();
      },
      error: (err) => console.error(err),
    });
  }
}
