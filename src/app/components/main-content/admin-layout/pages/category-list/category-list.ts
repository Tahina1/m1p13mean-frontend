import { Component, computed, effect, inject, signal } from '@angular/core';
import { CategoryService } from '@/components/shared/services/category-service';
import { ProductCategory } from '@/components/shared/models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList {
  private categoryService = inject(CategoryService);

  categories = signal<ProductCategory[]>([]);
  searchTerm = signal('');
  loading = signal(false);

  filteredCategories = computed(() => {
    const search = this.searchTerm().toLowerCase();

    return this.categories().filter((category) => category.name.toLowerCase().includes(search));
  });

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);

    this.categoryService.getProductCategories().subscribe({
      next: (res) => this.categories.set(res),
      complete: () => this.loading.set(false),
    });
  }

  resetSearch() {
    this.searchTerm.set('');
  }
}
