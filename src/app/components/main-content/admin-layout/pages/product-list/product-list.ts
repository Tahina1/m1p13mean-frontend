import { Pagination } from '@/components/shared/components/pagination/pagination';
import { Product, ProductCategory } from '@/components/shared/models/product';
import { CategoryService } from '@/components/shared/services/category-service';
import { ProductService } from '@/components/shared/services/product-service';
import { ShopService } from '@/components/shared/services/shop-service';
import { Component, inject, signal } from '@angular/core';

interface ProductApiResponse {
  products: Product[];
  pagination: Pagination;
}

@Component({
  selector: 'app-product-list',
  imports: [Pagination],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products = signal<Product[]>([]);
  categories = signal<ProductCategory[]>([]);

  page = signal(1);
  totalPages = signal(1);
  loading = signal(false);

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getProductCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
      },
      error: (err) => console.error('Error loading categories', err),
    });
  }

  loadProducts() {
    this.loading.set(true);

    this.productService.getAllProducts(this.page()).subscribe({
      next: (res) => {
        console.log(res);

        this.products.set(res.products);
        this.totalPages.set(res.pagination.totalPages);
      },
      error: (err) => console.error('Error loading products', err),
      complete: () => this.loading.set(false),
    });
  }

  onPageChange(p: number) {
    this.page.set(p);
    this.loadProducts();
  }

  getCategoryNames(categoryIds: string[]): string {
    const allCategories = this.categories();

    if (!categoryIds?.length) return '-';

    return categoryIds
      .map((id) => allCategories.find((c) => c._id === id)?.name)
      .filter(Boolean)
      .join(', ');
  }
}
