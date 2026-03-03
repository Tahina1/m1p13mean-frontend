import { Pagination } from '@/components/shared/components/pagination/pagination';
import { Product, ProductCategory } from '@/components/shared/models/product';
import { ProductService } from '@/components/shared/services/product-service';
import { Component, inject, signal } from '@angular/core';
import { EditShopModal } from '@/components/main-content/shop-layout/pages/edit-shop-modal/edit-shop-modal';
import { ProductModal } from '@/components/main-content/shop-layout/pages/product-modal/product-modal';

interface ProductApiResponse {
  products: Product[];
  pagination: Pagination;
}

@Component({
  selector: 'app-product-list',
  imports: [Pagination, ProductModal],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  isModalOpen = false;

  page = signal(1);
  totalPages = signal(1);
  loading = signal(false);

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
}
