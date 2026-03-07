import { Shop } from '@/components/shared/models/shop';
import { Product, ProductCategory } from '@/components/shared/models/product';
import { Pagination } from '@/components/shared/components/pagination/pagination';
import { CategoryService } from '@/components/shared/services/category-service';
import { ProductService } from '@/components/shared/services/product-service';
import { ShopService } from '@/components/shared/services/shop-service';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Pagination],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit {
  private shopService = inject(ShopService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  // ── Shops ────────────────────────────────────────────────────────────────
  shops = signal<Shop[]>([]);

  // ── Products ─────────────────────────────────────────────────────────────
  products = signal<Product[]>([]);
  categories = signal<ProductCategory[]>([]);
  loadingProducts = signal(true);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);

  // ── Filters ──────────────────────────────────────────────────────────────
  nameFilter = signal('');
  selectedCategoryIds = signal<string[]>([]);
  minPrice = signal('');
  maxPrice = signal('');
  showFilters = signal(false);

  ngOnInit() {
    this.loadShops();
    this.loadCategories();
    this.loadProducts(1);
  }

  ngAfterViewInit() {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  loadShops() {
    this.shopService.getShops().subscribe({
      next: (res) => this.shops.set(res.shops),
      error: (err) => console.error('Error loading shops', err),
    });
  }

  loadCategories() {
    this.categoryService.getProductCategories().subscribe({
      next: (res: any) => {
        const cats = Array.isArray(res) ? res : (res?.categories ?? res?.data ?? []);
        this.categories.set(cats);
      },
    });
  }

  loadProducts(page: number) {
    this.loadingProducts.set(true);
    this.currentPage.set(page);
    const min = this.minPrice() ? parseFloat(this.minPrice()) : undefined;
    const max = this.maxPrice() ? parseFloat(this.maxPrice()) : undefined;

    this.productService
      .searchProducts({
        name: this.nameFilter() || undefined,
        categoryIds: this.selectedCategoryIds().length ? this.selectedCategoryIds() : undefined,
        minPrice: min,
        maxPrice: max,
        page,
        limit: 15,
      })
      .subscribe({
        next: (res: any) => {
          this.products.set(res?.products ?? []);
          this.totalPages.set(res?.pagination?.totalPages ?? 1);
          this.totalItems.set(res?.pagination?.totalItems ?? (res?.products?.length ?? 0));
          this.loadingProducts.set(false);
        },
        error: () => this.loadingProducts.set(false),
      });
  }

  search() {
    this.loadProducts(1);
  }

  onPageChange(page: number) {
    this.loadProducts(page);
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleCategory(id: string) {
    this.selectedCategoryIds.update((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    );
  }

  toggleFilters() {
    this.showFilters.update((v) => !v);
  }

  isCategorySelected(id: string) {
    return this.selectedCategoryIds().includes(id);
  }

  hasActiveFilters() {
    return (
      this.nameFilter() ||
      this.selectedCategoryIds().length ||
      this.minPrice() ||
      this.maxPrice()
    );
  }

  clearFilters() {
    this.nameFilter.set('');
    this.selectedCategoryIds.set([]);
    this.minPrice.set('');
    this.maxPrice.set('');
    this.loadProducts(1);
  }
}
