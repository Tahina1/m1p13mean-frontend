import { Product } from '@/components/shared/models/product';
import { AuthService } from '@/components/shared/services/auth';
import { ProductService } from '@/components/shared/services/product-service';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductModal } from '../product-modal/product-modal';
import { Pagination } from '@/components/shared/components/pagination/pagination';
import { ConfirmModal } from '@/components/shared/components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, ProductModal, Pagination, ConfirmModal],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  selectedProduct = signal<Product | null>(null);
  deletePopup = signal(false);
  productToDelete: string | null = null;
  productName = signal('');

  page = signal(1);
  totalPages = signal(1);

  products = signal<Product[]>([]);
  loading = signal(true);

  isModalOpen = false;
  editingProduct: Product | null = null;

  searchTerm = signal('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  availability = signal<'all' | 'active' | 'inactive'>('all');

  filteredProducts = computed(() => {
    const products = this.products();
    const search = this.searchTerm().toLowerCase();
    const min = this.minPrice();
    const max = this.maxPrice();
    const availability = this.availability();

    return products.filter((p) => {
      // 🔎 Search by name
      const matchesName = p.name.toLowerCase().includes(search);

      // 💰 Price range
      const matchesMin = min !== null ? p.price >= min : true;
      const matchesMax = max !== null ? p.price <= max : true;

      // 📦 Availability
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
  }

  ngOnInit() {
    this.reloadProducts();
  }

  openDelete(product: Product) {
    this.productToDelete = product._id;
    this.productName.set(product.name);
    this.deletePopup.set(true);
  }

  confirmDelete() {
    if (!this.productToDelete) return;

    this.productService.deleteProduct(this.productToDelete).subscribe({
      next: () => {
        this.reloadProducts();
        this.deletePopup.set(false);
        this.productToDelete = null;
        this.productName.set('');
      },
      error: (err) => {
        console.error('DELETE ERROR', err);
        this.deletePopup.set(false);
      },
    });
  }

  reloadProducts() {
    const shopId = this.authService.shopId();
    if (!shopId) return;

    this.loading.set(true);

    this.productService.getProductsByShop(shopId, this.page()).subscribe({
      next: (res: any) => {
        this.products.set(res.products);
        this.totalPages.set(res.pagination.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onPageChange(p: number) {
    this.page.set(p);
    this.reloadProducts();
  }

  resetFilters() {
    this.searchTerm.set('');
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.availability.set('all');
  }
}
