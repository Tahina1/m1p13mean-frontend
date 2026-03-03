import { User } from '@/components/shared/models/user';
import { ShopService } from '@/components/shared/services/shop-service';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationComponent } from '@/components/shared/components/notification-component/notification-component';
import { NotificationService } from '@/components/shared/services/notification-service';

@Component({
  selector: 'app-edit-shop-modal',
  imports: [ReactiveFormsModule, NotificationComponent],
  templateUrl: './edit-shop-modal.html',
  styleUrl: './edit-shop-modal.scss',
})
export class EditShopModal {
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  private shopService = inject(ShopService);
  existingImages = signal<string[]>([]);

  isOpen = signal(false);
  editingShopId = '';

  files: File[] = [];
  shopUsers = signal<User[]>([]);

  @Output() created = new EventEmitter<void>();

  form = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    floor: ['', Validators.required],
    shopNumber: ['', Validators.required],
  });

  open(shop?: any) {
    this.isOpen.set(true);
    this.editingShopId = shop._id;

    this.form.patchValue({
      name: shop.name,
      category: shop.category,
      floor: shop.location?.floor || '',
      shopNumber: shop.location?.shopNumber || '',
    });
    this.existingImages.set(shop.gallery || []);
  }

  close() {
    this.isOpen.set(false);
  }

  onFiles(e: any) {
    this.files = Array.from(e.target.files);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.show('Please fill all required fields correctly', 'error');
      return;
    }

    const v = this.form.value;

    const formData = new FormData();
    formData.append('name', v.name ?? '');
    formData.append('category', v.category ?? '');
    formData.append('location[floor]', v.floor ?? '');
    formData.append('location[shopNumber]', v.shopNumber ?? '');

    this.files.forEach((f) => formData.append('gallery', f));

    this.shopService.updateShop(this.editingShopId, formData).subscribe({
      next: () => {
        this.created.emit();
        this.close();
        this.notificationService.show('Shop updated successfully', 'success');
      },
      error: (err) => {
        console.error('UPDATE ERROR', err);

        const message = err?.error?.message || err?.error?.error || 'Failed to update shop';

        this.notificationService.show(message, 'error');
      },
    });
  }
}
