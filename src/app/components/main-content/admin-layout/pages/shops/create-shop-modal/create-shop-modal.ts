import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ShopService } from '@/components/shared/services/shop-service';
import { UserService } from '@/components/shared/services/user-service';
import { User } from '@/components/shared/models/user';
import { Shop } from '@/components/shared/models/shop';

@Component({
  selector: 'app-create-shop-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-shop-modal.html',
  styleUrl: './create-shop-modal.scss',
})
export class CreateShopModal {
  private fb = inject(FormBuilder);
  private shopService = inject(ShopService);
  private userService = inject(UserService);
  existingImages = signal<string[]>([]);

  mode = signal<'create' | 'edit'>('create');
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
    ownerId: ['', Validators.required],
    status: ['PENDING'],
  });

  open(shop?: any) {
    this.isOpen.set(true);
    this.loadShopUsers();

    if (shop) {
      this.mode.set('edit');
      this.editingShopId = shop._id;

      this.form.patchValue({
        name: shop.name,
        category: shop.category,
        floor: shop.location?.floor || '',
        shopNumber: shop.location?.shopNumber || '',
        ownerId: shop.ownerId || '',
        status: shop.status || 'PENDING',
      });
      this.existingImages.set(shop.gallery || []);
    } else {
      this.mode.set('create');
      this.form.reset({
        name: '',
        category: '',
        floor: '',
        shopNumber: '',
        ownerId: '',
        status: 'PENDING',
      });
      this.files = [];
    }
  }
  loadShopUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.shopUsers.set(users.filter((u) => u.roles?.includes('SHOP')));
    });
  }

  close() {
    this.isOpen.set(false);
  }

  onFiles(e: any) {
    this.files = Array.from(e.target.files);
  }

  submit() {
    if (this.form.invalid) return;

    const v = this.form.value;

    const formData = new FormData();
    formData.append('name', v.name || '');
    formData.append('category', v.category || '');
    formData.append('location[floor]', v.floor || '');
    formData.append('location[shopNumber]', v.shopNumber || '');
    formData.append('ownerId', v.ownerId || '');

    this.files.forEach((f) => formData.append('gallery', f));

    // CREATE
    if (this.mode() === 'create') {
      this.shopService.createShop(formData).subscribe(() => {
        this.created.emit();
        this.close();
      });
      return;
    }

    // EDIT
    this.shopService.updateShop(this.editingShopId, formData).subscribe(() => {
      // status update (only if changed)
      this.shopService.updateShopStatus(this.editingShopId, v.status || 'PENDING').subscribe(() => {
        this.created.emit();
        this.close();
      });
    });
  }
}
