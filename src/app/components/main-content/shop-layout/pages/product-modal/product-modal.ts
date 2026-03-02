import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '@/components/shared/services/product-service';
import { AuthService } from '@/components/shared/services/auth';
import { CategoryService } from '@/components/shared/services/category-service';
import { Product } from '@/components/shared/models/product';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.scss',
})
export class ProductModal {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private categoryService = inject(CategoryService);

  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();
  @Input() editProduct: Product | null = null;

  files: File[] = [];
  categories = signal<any[]>([]);

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, Validators.required],
    categoryId: [''],
    isActive: [true],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    this.loadCategories();
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
        });
      });
    }
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
    if (this.form.invalid) return;

    const shopId = this.authService.shopId();
    if (!shopId) return;

    const v = this.form.value;

    const formData = new FormData();
    formData.append('name', v.name || '');
    formData.append('description', v.description || '');
    formData.append('price', String(v.price || 0));
    formData.append('shopId', shopId);
    formData.append('isActive', String(v.isActive ?? true));
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
