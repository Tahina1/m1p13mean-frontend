import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '@/components/shared/services/product-service';
import { AuthService } from '@/components/shared/services/auth';
import { CategoryService } from '@/components/shared/services/category-service';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.scss',
})
export class ProductModal {
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private categoryService = inject(CategoryService);

  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  // form fields
  name = '';
  description = '';
  price: number | null = null;
  categoryId = '';
  isActive = true;
  files: File[] = [];

  categories = signal<any[]>([]);

  ngOnInit() {
    this.loadCategories();
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
    const shopId = this.authService.shopId();

    if (!shopId) {
      console.error('No shopId found');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('price', String(this.price));
    formData.append('shopId', shopId);
    formData.append('isActive', String(this.isActive));

    if (this.categoryId) {
      formData.append('categoryIds', this.categoryId);
    }

    this.files.forEach((file) => {
      formData.append('images', file);
    });

    this.productService.createProduct(formData).subscribe({
      next: () => {
        this.created.emit(); // reload products list
        this.close();
        this.reset();
      },
      error: (err) => console.error('CREATE PRODUCT ERROR', err),
    });
  }

  reset() {
    this.name = '';
    this.description = '';
    this.price = null;
    this.categoryId = '';
    this.files = [];
    this.isActive = true;
  }
}
