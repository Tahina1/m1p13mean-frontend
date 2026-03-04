import { NotificationComponent } from '@/components/shared/components/notification-component/notification-component';
import { ProductCategory } from '@/components/shared/models/product';
import { CategoryService } from '@/components/shared/services/category-service';
import { NotificationService } from '@/components/shared/services/notification-service';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-modal',
  imports: [ReactiveFormsModule, NotificationComponent],
  templateUrl: './category-modal.html',
  styleUrl: './category-modal.scss',
})
export class CategoryModal {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private notificationService = inject(NotificationService);

  @Input() isOpen = false;
  @Input() editCategory: ProductCategory | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  form = this.fb.group({
    name: ['', Validators.required],
    isActive: [true],
  });

  ngOnChanges() {
    if (this.editCategory && this.isOpen) {
      this.form.patchValue({
        name: this.editCategory.name,
        isActive: this.editCategory.isActive,
      });
    }
  }

  close() {
    this.closeModal.emit();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.show('Please fill required fields', 'error');
      return;
    }

    const v = this.form.value;
    const name = v.name || '';

    // CREATE
    if (!this.editCategory) {
      this.categoryService.createProductCategory(name).subscribe({
        next: () => {
          this.notificationService.show('Category created successfully', 'success');
          this.created.emit();
          this.close();
          this.reset();
        },
        error: (err) => {
          const message = err?.error?.message || 'Failed to create category';
          this.notificationService.show(message, 'error');
        },
      });
    }

    // UPDATE
    else {
      this.categoryService.updateProduct(this.editCategory._id, name).subscribe({
        next: () => {
          this.notificationService.show('Category updated successfully', 'success');
          this.created.emit();
          this.close();
          this.reset();
        },
        error: (err) => {
          const message = err?.error?.message || 'Failed to update category';
          this.notificationService.show(message, 'error');
        },
      });
    }
  }

  reset() {
    this.form.reset({
      name: '',
      isActive: true,
    });
  }
}
