import { Product } from '@/components/shared/models/product';
import { AuthService } from '@/components/shared/services/auth';
import { CategoryService } from '@/components/shared/services/category-service';
import { ProductService } from '@/components/shared/services/product-service';
import { ShopService } from '@/components/shared/services/shop-service';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-product-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-product-modal.html',
  styleUrl: './edit-product-modal.scss',
})
export class EditProductModal {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private shopService = inject(ShopService);
  private authService = inject(AuthService);
  private categoryService = inject(CategoryService);

  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();
  @Input() editProduct: Product | null = null;

  files: File[] = [];
  categories = signal<any[]>([]);
  shops = signal<any[]>([]);

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, Validators.required],
    categoryId: [''],
    shopId: ['', Validators.required],
    isActive: [true],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    this.loadCategories();
    this.loadShops();
  }

  ngOnChanges() {
    if (this.editProduct && this.isOpen) {
      setTimeout(() => {
        this.form.patchValue({
          name: this.editProduct?.name || '',
          description: this.editProduct?.description || '',
          price: this.editProduct?.price || 0,
          isActive: this.editProduct?.isActive ?? true,
          categoryId: this.editProduct?.categoryIds?.[0]?._id || '',
          stock: this.editProduct?.stock || 0,
          shopId: this.editProduct?.shopId || '',
        });
      });
    }
  }

  loadShops() {
    this.shopService.getShops(1, 100).subscribe({
      next: (res: any) => {
        this.shops.set(res.shops || res);
      },
      error: (err) => console.error('Error loading shops', err),
    });
  }

  loadCategories() {
    this.categoryService.getProductCategories().subscribe((res: any) => {
      this.categories.set(res.categories || res);
    });
  }

  close() {
    this.closeModal.emit();
  }

  onFiles(e: any) {
    this.files = Array.from(e.target.files);
  }

  submit() {
    const v = this.form.value;

    if (!v.shopId) return;

    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('name', v.name || '');
    formData.append('description', v.description || '');
    formData.append('price', String(v.price || 0));
    formData.append('isActive', String(v.isActive ?? true));
    formData.append('_id', v.shopId);
    formData.append('stock', String(v.stock || 0));

    if (v.categoryId) {
      formData.append('categoryIds', v.categoryId);
    }

    this.files.forEach((file) => formData.append('images', file));

    // 🔥 CREATE MODE
    if (!this.editProduct) {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.created.emit();
          this.close();
          this.reset();
        },
        error: (err) => console.error('CREATE ERROR', err),
      });
    }

    // 🔥 EDIT MODE (later ready)
    else {
      this.productService.updateProduct(this.editProduct._id, formData).subscribe({
        next: () => {
          this.created.emit();
          this.close();
          this.reset();
        },
        error: (err) => console.error('PATCH ERROR', err),
      });
    }
  }

  reset() {
    this.form.reset({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      isActive: true,
      stock: 0,
    });

    this.files = [];
  }
}
