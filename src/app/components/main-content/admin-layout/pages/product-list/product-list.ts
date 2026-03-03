import { Pagination } from '@/components/shared/components/pagination/pagination';
import { Product, ProductCategory } from '@/components/shared/models/product';
import { ProductService } from '@/components/shared/services/product-service';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { EditProductModal } from '../edit-product-modal/edit-product-modal';

interface ProductApiResponse {
  products: Product[];
  pagination: Pagination;
}

@Component({
  selector: 'app-product-list',
  imports: [Pagination, EditProductModal],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  isModalOpen = false;
  editingProduct: Product | null = null;

  page = signal(1);
  totalPages = signal(1);
  loading = signal(false);
  searchTerm = signal('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  availability = signal<'all' | 'active' | 'inactive'>('all');

  filteredProducts = computed(() => {
    const list = this.products();
    const search = this.searchTerm().toLowerCase();
    const min = this.minPrice();
    const max = this.maxPrice();
    const availability = this.availability();

    return list.filter((p) => {
      const matchesName = p.name.toLowerCase().includes(search);

      const matchesMin = min !== null ? p.price >= min : true;
      const matchesMax = max !== null ? p.price <= max : true;

      const matchesAvailability =
        availability === 'all' ? true : availability === 'active' ? p.isActive : !p.isActive;

      return matchesName && matchesMin && matchesMax && matchesAvailability;
    });
  });

  constructor() {
    effect(() => {
      this.searchTerm();
      this.minPrice();
      this.maxPrice();
      this.availability();
      this.page.set(1);
    });
  }

  ngOnInit() {
    this.loadProducts();
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

  editProduct(product: Product) {
    this.productService.open(product);
  }

  openCreate() {
    this.editingProduct = null;
    this.isModalOpen = true;
  }

  openEdit(product: any) {
    const normalized: Product = {
      _id: product._id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      images: product.images || [],
      shopId: product.shopId || '',
      isActive: product.isActive,
      stock: product.stock,

      // 🔥 convert categories → categoryIds
      categoryIds: (product.categories || []).map((id: string) => ({
        _id: id,
        name: '',
        isActive: true,
        createdAt: '',
        updatedAt: '',
      })),
    };

    this.editingProduct = normalized;
    this.isModalOpen = true;
    this.loadProducts();
  }

  resetFilters() {
    this.searchTerm.set('');
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.availability.set('all');
  }
}
