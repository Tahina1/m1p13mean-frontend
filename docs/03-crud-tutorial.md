# Tutoriel CRUD : Gestion de Produits

Ce tutoriel te guide pas à pas pour créer un module CRUD complet (Create, Read, Update, Delete) en suivant l'architecture Clean Architecture + CQRS.

## Objectif

Créer un module de gestion de **Produits** avec :
- Liste des produits (avec pagination)
- Détail d'un produit
- Création d'un produit
- Modification d'un produit
- Suppression d'un produit
- Simulation d'API (mock)

---

## Table des matières

1. [Étape 1 : Domain Layer](#étape-1--domain-layer)
2. [Étape 2 : Infrastructure Layer](#étape-2--infrastructure-layer)
3. [Étape 3 : Application Layer](#étape-3--application-layer)
4. [Étape 4 : Presentation Layer](#étape-4--presentation-layer)
5. [Étape 5 : Routes et Navigation](#étape-5--routes-et-navigation)
6. [Étape 6 : Test complet](#étape-6--test-complet)

---

## Étape 1 : Domain Layer

Créer les interfaces et types métier.

### 1.1 Créer le dossier

```
src/app/domain/products/
```

### 1.2 Créer l'interface Product

**Fichier** : `src/app/domain/products/product.interface.ts`

```typescript
/**
 * Interface représentant un Produit.
 *
 * C'est le modèle métier - pas de logique, juste la structure.
 */
export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Catégories de produits.
 */
export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  FOOD = 'food',
  BOOKS = 'books',
  OTHER = 'other',
}

/**
 * DTO pour créer un produit.
 * Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>
 * signifie "tous les champs de IProduct sauf id, createdAt, updatedAt"
 */
export interface ICreateProductDto {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
  imageUrl?: string;
}

/**
 * DTO pour mettre à jour un produit.
 * Partial<T> rend tous les champs optionnels.
 */
export interface IUpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: ProductCategory;
  stock?: number;
  imageUrl?: string;
}

/**
 * Filtres pour rechercher des produits.
 */
export interface IProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
```

### 1.3 Créer le fichier index (barrel export)

**Fichier** : `src/app/domain/products/index.ts`

```typescript
export * from './product.interface';
```

> **Note** : Les fichiers `index.ts` permettent d'importer plus facilement :
> ```typescript
> // Sans index.ts
> import { IProduct } from '@domain/products/product.interface';
>
> // Avec index.ts
> import { IProduct } from '@domain/products';
> ```

---

## Étape 2 : Infrastructure Layer

Créer les routes API, le store et le service mock.

### 2.1 Créer les routes API

**Fichier** : `src/app/infrastructure/api/routes/product.routes.ts`

```typescript
import { createApiUrl } from './base.routes';

/**
 * Routes API pour les produits.
 *
 * Chaque méthode retourne l'URL complète.
 */
export const productRoutes = {
  getAll: () => createApiUrl('/products'),
  getById: (id: string) => createApiUrl(`/products/${id}`),
  create: () => createApiUrl('/products'),
  update: (id: string) => createApiUrl(`/products/${id}`),
  delete: (id: string) => createApiUrl(`/products/${id}`),
};
```

### 2.2 Ajouter au fichier api.routes.ts

**Fichier** : `src/app/infrastructure/api/api.routes.ts`

```typescript
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';
import { productRoutes } from './routes/product.routes';  // ← Ajouter

export const apiRoutes = {
  auth: authRoutes,
  users: userRoutes,
  products: productRoutes,  // ← Ajouter
};
```

### 2.3 Créer le Store pour les produits

**Fichier** : `src/app/infrastructure/stores/product.store.ts`

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { IProduct, IProductFilters } from '@domain/products';
import { IPaginationInfo } from '@domain/common';

/**
 * Store pour gérer l'état des produits.
 *
 * Utilise Angular Signals pour la réactivité.
 */
@Injectable({ providedIn: 'root' })
export class ProductStore {
  // ═══════════════════════════════════════════════════════════════
  // ÉTAT PRIVÉ
  // ═══════════════════════════════════════════════════════════════

  private readonly _products = signal<IProduct[]>([]);
  private readonly _selectedProduct = signal<IProduct | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _pagination = signal<IPaginationInfo | null>(null);
  private readonly _filters = signal<IProductFilters>({});

  // ═══════════════════════════════════════════════════════════════
  // ÉTAT PUBLIC (lecture seule)
  // ═══════════════════════════════════════════════════════════════

  readonly products = this._products.asReadonly();
  readonly selectedProduct = this._selectedProduct.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly pagination = this._pagination.asReadonly();
  readonly filters = this._filters.asReadonly();

  // ═══════════════════════════════════════════════════════════════
  // SIGNAUX DÉRIVÉS (computed)
  // ═══════════════════════════════════════════════════════════════

  /**
   * Nombre total de produits.
   */
  readonly totalProducts = computed(() => this._pagination()?.total ?? 0);

  /**
   * Y a-t-il des produits ?
   */
  readonly hasProducts = computed(() => this._products().length > 0);

  /**
   * Produits filtrés par catégorie (exemple de computed)
   */
  readonly productsByCategory = computed(() => {
    const products = this._products();
    const category = this._filters().category;
    if (!category) return products;
    return products.filter(p => p.category === category);
  });

  // ═══════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═══════════════════════════════════════════════════════════════

  setProducts(products: IProduct[]): void {
    this._products.set(products);
  }

  setSelectedProduct(product: IProduct | null): void {
    this._selectedProduct.set(product);
  }

  setPagination(pagination: IPaginationInfo): void {
    this._pagination.set(pagination);
  }

  setFilters(filters: IProductFilters): void {
    this._filters.set(filters);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  /**
   * Ajouter un produit à la liste.
   */
  addProduct(product: IProduct): void {
    this._products.update(products => [...products, product]);
  }

  /**
   * Mettre à jour un produit dans la liste.
   */
  updateProduct(updated: IProduct): void {
    this._products.update(products =>
      products.map(p => p.id === updated.id ? updated : p)
    );
  }

  /**
   * Supprimer un produit de la liste.
   */
  removeProduct(id: string): void {
    this._products.update(products =>
      products.filter(p => p.id !== id)
    );
  }

  /**
   * Réinitialiser le store.
   */
  reset(): void {
    this._products.set([]);
    this._selectedProduct.set(null);
    this._pagination.set(null);
    this._filters.set({});
    this._error.set(null);
  }
}
```

### 2.4 Créer un Service Mock (simulation d'API)

**Fichier** : `src/app/infrastructure/services/product-mock.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import {
  IProduct,
  ICreateProductDto,
  IUpdateProductDto,
  ProductCategory
} from '@domain/products';
import { IApiResponse, IPaginationParams } from '@domain/common';

/**
 * Service Mock pour simuler une API de produits.
 *
 * Utile pour le développement sans backend.
 * Remplacer par de vrais appels HTTP plus tard.
 */
@Injectable({ providedIn: 'root' })
export class ProductMockService {
  // Base de données simulée
  private products: IProduct[] = [
    {
      id: '1',
      name: 'MacBook Pro',
      description: 'Laptop Apple 14 pouces M3',
      price: 1999.99,
      category: ProductCategory.ELECTRONICS,
      stock: 50,
      imageUrl: 'https://via.placeholder.com/200',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'iPhone 15',
      description: 'Smartphone Apple dernier modèle',
      price: 999.99,
      category: ProductCategory.ELECTRONICS,
      stock: 100,
      imageUrl: 'https://via.placeholder.com/200',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      name: 'T-Shirt Angular',
      description: 'T-shirt développeur Angular',
      price: 29.99,
      category: ProductCategory.CLOTHING,
      stock: 200,
      imageUrl: 'https://via.placeholder.com/200',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
    {
      id: '4',
      name: 'Clean Code',
      description: 'Livre de Robert C. Martin',
      price: 39.99,
      category: ProductCategory.BOOKS,
      stock: 75,
      imageUrl: 'https://via.placeholder.com/200',
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-04'),
    },
  ];

  private nextId = 5;

  /**
   * Simuler un délai réseau.
   */
  private simulateDelay<T>(data: T, ms = 500): Observable<T> {
    return of(data).pipe(delay(ms));
  }

  /**
   * GET /products - Liste paginée.
   */
  getProducts(params?: IPaginationParams): Observable<IApiResponse<IProduct[]>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = this.products.slice(start, end);

    const response: IApiResponse<IProduct[]> = {
      status: 'success',
      message: 'Products retrieved successfully',
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total: this.products.length,
        totalPages: Math.ceil(this.products.length / limit),
        hasNextPage: end < this.products.length,
        hasPrevPage: page > 1,
      },
    };

    return this.simulateDelay(response);
  }

  /**
   * GET /products/:id - Détail d'un produit.
   */
  getProductById(id: string): Observable<IApiResponse<IProduct>> {
    const product = this.products.find(p => p.id === id);

    if (!product) {
      return throwError(() => ({
        status: 'error',
        message: 'Product not found',
      }));
    }

    return this.simulateDelay({
      status: 'success',
      message: 'Product retrieved successfully',
      data: product,
    });
  }

  /**
   * POST /products - Créer un produit.
   */
  createProduct(dto: ICreateProductDto): Observable<IApiResponse<IProduct>> {
    const newProduct: IProduct = {
      id: String(this.nextId++),
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.push(newProduct);

    return this.simulateDelay({
      status: 'success',
      message: 'Product created successfully',
      data: newProduct,
    }, 800);
  }

  /**
   * PUT /products/:id - Mettre à jour un produit.
   */
  updateProduct(id: string, dto: IUpdateProductDto): Observable<IApiResponse<IProduct>> {
    const index = this.products.findIndex(p => p.id === id);

    if (index === -1) {
      return throwError(() => ({
        status: 'error',
        message: 'Product not found',
      }));
    }

    const updated: IProduct = {
      ...this.products[index],
      ...dto,
      updatedAt: new Date(),
    };

    this.products[index] = updated;

    return this.simulateDelay({
      status: 'success',
      message: 'Product updated successfully',
      data: updated,
    }, 600);
  }

  /**
   * DELETE /products/:id - Supprimer un produit.
   */
  deleteProduct(id: string): Observable<IApiResponse<void>> {
    const index = this.products.findIndex(p => p.id === id);

    if (index === -1) {
      return throwError(() => ({
        status: 'error',
        message: 'Product not found',
      }));
    }

    this.products.splice(index, 1);

    return this.simulateDelay({
      status: 'success',
      message: 'Product deleted successfully',
    }, 400);
  }
}
```

---

## Étape 3 : Application Layer

Créer les Commands, Queries et le Service façade.

### 3.1 Créer les dossiers

```
src/app/application/commands/products/
src/app/application/queries/products/
```

### 3.2 Query : GetProducts

**Fichier** : `src/app/application/queries/products/get-products.query.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { IProduct } from '@domain/products';
import { IApiResponse, IPaginationParams } from '@domain/common';
import { ProductStore } from '@infrastructure/stores/product.store';
import { ProductMockService } from '@infrastructure/services/product-mock.service';

/**
 * QUERY : Récupérer la liste des produits.
 */
@Injectable({ providedIn: 'root' })
export class GetProductsQuery {
  private readonly mockService = inject(ProductMockService);
  private readonly productStore = inject(ProductStore);

  execute(params?: IPaginationParams): Observable<IApiResponse<IProduct[]>> {
    this.productStore.setLoading(true);
    this.productStore.setError(null);

    return this.mockService.getProducts(params).pipe(
      tap((response) => {
        if (response.status === 'success' && response.data) {
          this.productStore.setProducts(response.data);
          if (response.pagination) {
            this.productStore.setPagination(response.pagination);
          }
        }
      }),
      catchError((error) => {
        this.productStore.setError(error.message || 'Failed to load products');
        return throwError(() => error);
      }),
      finalize(() => {
        this.productStore.setLoading(false);
      })
    );
  }
}
```

### 3.3 Query : GetProductById

**Fichier** : `src/app/application/queries/products/get-product-by-id.query.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { IProduct } from '@domain/products';
import { IApiResponse } from '@domain/common';
import { ProductStore } from '@infrastructure/stores/product.store';
import { ProductMockService } from '@infrastructure/services/product-mock.service';

/**
 * QUERY : Récupérer un produit par ID.
 */
@Injectable({ providedIn: 'root' })
export class GetProductByIdQuery {
  private readonly mockService = inject(ProductMockService);
  private readonly productStore = inject(ProductStore);

  execute(id: string): Observable<IApiResponse<IProduct>> {
    this.productStore.setLoading(true);
    this.productStore.setError(null);

    return this.mockService.getProductById(id).pipe(
      tap((response) => {
        if (response.status === 'success' && response.data) {
          this.productStore.setSelectedProduct(response.data);
        }
      }),
      catchError((error) => {
        this.productStore.setError(error.message || 'Product not found');
        return throwError(() => error);
      }),
      finalize(() => {
        this.productStore.setLoading(false);
      })
    );
  }
}
```

### 3.4 Command : CreateProduct

**Fichier** : `src/app/application/commands/products/create-product.command.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { IProduct, ICreateProductDto } from '@domain/products';
import { IApiResponse } from '@domain/common';
import { ProductStore } from '@infrastructure/stores/product.store';
import { ProductMockService } from '@infrastructure/services/product-mock.service';

/**
 * COMMAND : Créer un nouveau produit.
 */
@Injectable({ providedIn: 'root' })
export class CreateProductCommand {
  private readonly mockService = inject(ProductMockService);
  private readonly productStore = inject(ProductStore);
  private readonly router = inject(Router);

  execute(dto: ICreateProductDto): Observable<IApiResponse<IProduct>> {
    this.productStore.setLoading(true);
    this.productStore.setError(null);

    return this.mockService.createProduct(dto).pipe(
      tap((response) => {
        if (response.status === 'success' && response.data) {
          // Ajouter le produit à la liste
          this.productStore.addProduct(response.data);
          // Rediriger vers la liste
          this.router.navigate(['/products']);
        }
      }),
      catchError((error) => {
        this.productStore.setError(error.message || 'Failed to create product');
        return throwError(() => error);
      }),
      finalize(() => {
        this.productStore.setLoading(false);
      })
    );
  }
}
```

### 3.5 Command : UpdateProduct

**Fichier** : `src/app/application/commands/products/update-product.command.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { IProduct, IUpdateProductDto } from '@domain/products';
import { IApiResponse } from '@domain/common';
import { ProductStore } from '@infrastructure/stores/product.store';
import { ProductMockService } from '@infrastructure/services/product-mock.service';

/**
 * COMMAND : Mettre à jour un produit.
 */
@Injectable({ providedIn: 'root' })
export class UpdateProductCommand {
  private readonly mockService = inject(ProductMockService);
  private readonly productStore = inject(ProductStore);
  private readonly router = inject(Router);

  execute(id: string, dto: IUpdateProductDto): Observable<IApiResponse<IProduct>> {
    this.productStore.setLoading(true);
    this.productStore.setError(null);

    return this.mockService.updateProduct(id, dto).pipe(
      tap((response) => {
        if (response.status === 'success' && response.data) {
          // Mettre à jour le produit dans la liste
          this.productStore.updateProduct(response.data);
          // Rediriger vers le détail
          this.router.navigate(['/products', id]);
        }
      }),
      catchError((error) => {
        this.productStore.setError(error.message || 'Failed to update product');
        return throwError(() => error);
      }),
      finalize(() => {
        this.productStore.setLoading(false);
      })
    );
  }
}
```

### 3.6 Command : DeleteProduct

**Fichier** : `src/app/application/commands/products/delete-product.command.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { IApiResponse } from '@domain/common';
import { ProductStore } from '@infrastructure/stores/product.store';
import { ProductMockService } from '@infrastructure/services/product-mock.service';

/**
 * COMMAND : Supprimer un produit.
 */
@Injectable({ providedIn: 'root' })
export class DeleteProductCommand {
  private readonly mockService = inject(ProductMockService);
  private readonly productStore = inject(ProductStore);
  private readonly router = inject(Router);

  execute(id: string): Observable<IApiResponse<void>> {
    this.productStore.setLoading(true);
    this.productStore.setError(null);

    return this.mockService.deleteProduct(id).pipe(
      tap((response) => {
        if (response.status === 'success') {
          // Supprimer le produit de la liste
          this.productStore.removeProduct(id);
          // Rediriger vers la liste
          this.router.navigate(['/products']);
        }
      }),
      catchError((error) => {
        this.productStore.setError(error.message || 'Failed to delete product');
        return throwError(() => error);
      }),
      finalize(() => {
        this.productStore.setLoading(false);
      })
    );
  }
}
```

### 3.7 Fichiers index

**Fichier** : `src/app/application/queries/products/index.ts`

```typescript
export * from './get-products.query';
export * from './get-product-by-id.query';
```

**Fichier** : `src/app/application/commands/products/index.ts`

```typescript
export * from './create-product.command';
export * from './update-product.command';
export * from './delete-product.command';
```

### 3.8 Service Façade : ProductService

**Fichier** : `src/app/application/services/product.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct, ICreateProductDto, IUpdateProductDto } from '@domain/products';
import { IApiResponse, IPaginationParams } from '@domain/common';
import { ProductStore } from '@infrastructure/stores/product.store';
import { GetProductsQuery } from '@application/queries/products/get-products.query';
import { GetProductByIdQuery } from '@application/queries/products/get-product-by-id.query';
import { CreateProductCommand } from '@application/commands/products/create-product.command';
import { UpdateProductCommand } from '@application/commands/products/update-product.command';
import { DeleteProductCommand } from '@application/commands/products/delete-product.command';

/**
 * SERVICE FAÇADE : ProductService
 *
 * Point d'entrée unique pour les Components.
 * Expose l'état (du Store) et les actions (Commands/Queries).
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  // Store
  private readonly productStore = inject(ProductStore);

  // Queries
  private readonly getProductsQuery = inject(GetProductsQuery);
  private readonly getProductByIdQuery = inject(GetProductByIdQuery);

  // Commands
  private readonly createProductCommand = inject(CreateProductCommand);
  private readonly updateProductCommand = inject(UpdateProductCommand);
  private readonly deleteProductCommand = inject(DeleteProductCommand);

  // ═══════════════════════════════════════════════════════════════
  // ÉTAT (exposé depuis le Store)
  // ═══════════════════════════════════════════════════════════════

  readonly products = this.productStore.products;
  readonly selectedProduct = this.productStore.selectedProduct;
  readonly loading = this.productStore.loading;
  readonly error = this.productStore.error;
  readonly pagination = this.productStore.pagination;
  readonly totalProducts = this.productStore.totalProducts;
  readonly hasProducts = this.productStore.hasProducts;

  // ═══════════════════════════════════════════════════════════════
  // QUERIES (Lecture)
  // ═══════════════════════════════════════════════════════════════

  getProducts(params?: IPaginationParams): Observable<IApiResponse<IProduct[]>> {
    return this.getProductsQuery.execute(params);
  }

  getProductById(id: string): Observable<IApiResponse<IProduct>> {
    return this.getProductByIdQuery.execute(id);
  }

  // ═══════════════════════════════════════════════════════════════
  // COMMANDS (Écriture)
  // ═══════════════════════════════════════════════════════════════

  createProduct(dto: ICreateProductDto): Observable<IApiResponse<IProduct>> {
    return this.createProductCommand.execute(dto);
  }

  updateProduct(id: string, dto: IUpdateProductDto): Observable<IApiResponse<IProduct>> {
    return this.updateProductCommand.execute(id, dto);
  }

  deleteProduct(id: string): Observable<IApiResponse<void>> {
    return this.deleteProductCommand.execute(id);
  }

  // ═══════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════

  clearSelectedProduct(): void {
    this.productStore.setSelectedProduct(null);
  }

  clearError(): void {
    this.productStore.setError(null);
  }

  reset(): void {
    this.productStore.reset();
  }
}
```

---

## Étape 4 : Presentation Layer

Créer les composants UI.

### 4.1 Créer les dossiers

```
src/app/presentation/pages/products/
├── product-list/
├── product-detail/
├── product-form/
└── index.ts
```

### 4.2 Component : ProductList

**Fichier** : `src/app/presentation/pages/products/product-list/product-list.component.ts`

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '@application/services/product.service';
import { ProductCategory } from '@domain/products';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Produits</h1>
        <a
          routerLink="/products/new"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          + Nouveau produit
        </a>
      </div>

      <!-- Loading state -->
      @if (productService.loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }

      <!-- Error state -->
      @if (productService.error()) {
        <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
          {{ productService.error() }}
        </div>
      }

      <!-- Product grid -->
      @if (!productService.loading() && productService.hasProducts()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (product of productService.products(); track product.id) {
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <!-- Image -->
              @if (product.imageUrl) {
                <img
                  [src]="product.imageUrl"
                  [alt]="product.name"
                  class="w-full h-48 object-cover"
                />
              }

              <!-- Content -->
              <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                  <h2 class="text-lg font-semibold text-gray-900">{{ product.name }}</h2>
                  <span class="text-lg font-bold text-indigo-600">
                    {{ product.price | currency:'EUR' }}
                  </span>
                </div>

                <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                  {{ product.description }}
                </p>

                <div class="flex justify-between items-center">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ getCategoryLabel(product.category) }}
                  </span>
                  <span class="text-sm text-gray-500">
                    Stock: {{ product.stock }}
                  </span>
                </div>

                <!-- Actions -->
                <div class="mt-4 flex gap-2">
                  <a
                    [routerLink]="['/products', product.id]"
                    class="flex-1 text-center bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 text-sm"
                  >
                    Voir
                  </a>
                  <a
                    [routerLink]="['/products', product.id, 'edit']"
                    class="flex-1 text-center bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md hover:bg-indigo-200 text-sm"
                  >
                    Modifier
                  </a>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Pagination info -->
        @if (productService.pagination()) {
          <div class="mt-6 text-center text-gray-500">
            Affichage de {{ productService.products().length }} sur {{ productService.totalProducts() }} produits
          </div>
        }
      }

      <!-- Empty state -->
      @if (!productService.loading() && !productService.hasProducts()) {
        <div class="text-center py-12">
          <p class="text-gray-500 mb-4">Aucun produit trouvé</p>
          <a
            routerLink="/products/new"
            class="text-indigo-600 hover:text-indigo-500"
          >
            Créer votre premier produit
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProductListComponent implements OnInit {
  protected readonly productService = inject(ProductService);

  ngOnInit(): void {
    // Charger les produits au démarrage
    this.productService.getProducts({ page: 1, limit: 10 }).subscribe();
  }

  getCategoryLabel(category: ProductCategory): string {
    const labels: Record<ProductCategory, string> = {
      [ProductCategory.ELECTRONICS]: 'Électronique',
      [ProductCategory.CLOTHING]: 'Vêtements',
      [ProductCategory.FOOD]: 'Alimentation',
      [ProductCategory.BOOKS]: 'Livres',
      [ProductCategory.OTHER]: 'Autre',
    };
    return labels[category] || category;
  }
}
```

### 4.3 Component : ProductDetail

**Fichier** : `src/app/presentation/pages/products/product-detail/product-detail.component.ts`

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '@application/services/product.service';
import { ProductCategory } from '@domain/products';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Back button -->
      <a routerLink="/products" class="text-indigo-600 hover:text-indigo-500 mb-6 inline-block">
        ← Retour aux produits
      </a>

      <!-- Loading -->
      @if (productService.loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }

      <!-- Error -->
      @if (productService.error()) {
        <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {{ productService.error() }}
        </div>
      }

      <!-- Product detail -->
      @if (productService.selectedProduct(); as product) {
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="md:flex">
            <!-- Image -->
            @if (product.imageUrl) {
              <div class="md:w-1/3">
                <img
                  [src]="product.imageUrl"
                  [alt]="product.name"
                  class="w-full h-64 md:h-full object-cover"
                />
              </div>
            }

            <!-- Content -->
            <div class="p-6 md:w-2/3">
              <div class="flex justify-between items-start mb-4">
                <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
                <span class="text-2xl font-bold text-indigo-600">
                  {{ product.price | currency:'EUR' }}
                </span>
              </div>

              <p class="text-gray-600 mb-6">{{ product.description }}</p>

              <div class="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span class="text-sm text-gray-500">Catégorie</span>
                  <p class="font-medium">{{ getCategoryLabel(product.category) }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Stock</span>
                  <p class="font-medium" [class.text-red-600]="product.stock < 10">
                    {{ product.stock }} unités
                  </p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Créé le</span>
                  <p class="font-medium">{{ product.createdAt | date:'dd/MM/yyyy' }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Mis à jour le</span>
                  <p class="font-medium">{{ product.updatedAt | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3">
                <a
                  [routerLink]="['/products', product.id, 'edit']"
                  class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                >
                  Modifier
                </a>
                <button
                  (click)="onDelete()"
                  class="bg-red-100 text-red-700 px-6 py-2 rounded-md hover:bg-red-200"
                  [disabled]="productService.loading()"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  protected readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.productService.getProductById(id).subscribe();
    }
  }

  getCategoryLabel(category: ProductCategory): string {
    const labels: Record<ProductCategory, string> = {
      [ProductCategory.ELECTRONICS]: 'Électronique',
      [ProductCategory.CLOTHING]: 'Vêtements',
      [ProductCategory.FOOD]: 'Alimentation',
      [ProductCategory.BOOKS]: 'Livres',
      [ProductCategory.OTHER]: 'Autre',
    };
    return labels[category] || category;
  }

  onDelete(): void {
    const product = this.productService.selectedProduct();
    if (product && confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(product.id).subscribe();
    }
  }
}
```

### 4.4 Component : ProductForm

**Fichier** : `src/app/presentation/pages/products/product-form/product-form.component.ts`

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '@application/services/product.service';
import { ProductCategory, ICreateProductDto, IUpdateProductDto } from '@domain/products';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <!-- Back button -->
      <a routerLink="/products" class="text-indigo-600 hover:text-indigo-500 mb-6 inline-block">
        ← Retour aux produits
      </a>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          {{ isEditMode ? 'Modifier le produit' : 'Nouveau produit' }}
        </h1>

        <!-- Error -->
        @if (productService.error()) {
          <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
            {{ productService.error() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nom du produit *
            </label>
            <input
              type="text"
              formControlName="name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: MacBook Pro"
            />
            @if (form.get('name')?.touched && form.get('name')?.errors?.['required']) {
              <p class="mt-1 text-sm text-red-600">Le nom est requis</p>
            }
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              formControlName="description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Description du produit..."
            ></textarea>
            @if (form.get('description')?.touched && form.get('description')?.errors?.['required']) {
              <p class="mt-1 text-sm text-red-600">La description est requise</p>
            }
          </div>

          <!-- Price & Stock -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Prix (€) *
              </label>
              <input
                type="number"
                formControlName="price"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="99.99"
              />
              @if (form.get('price')?.touched && form.get('price')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-600">Le prix est requis</p>
              }
              @if (form.get('price')?.touched && form.get('price')?.errors?.['min']) {
                <p class="mt-1 text-sm text-red-600">Le prix doit être positif</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                formControlName="stock"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="100"
              />
              @if (form.get('stock')?.touched && form.get('stock')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-600">Le stock est requis</p>
              }
            </div>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Catégorie *
            </label>
            <select
              formControlName="category"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Sélectionner une catégorie</option>
              @for (cat of categories; track cat.value) {
                <option [value]="cat.value">{{ cat.label }}</option>
              }
            </select>
            @if (form.get('category')?.touched && form.get('category')?.errors?.['required']) {
              <p class="mt-1 text-sm text-red-600">La catégorie est requise</p>
            }
          </div>

          <!-- Image URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              URL de l'image (optionnel)
            </label>
            <input
              type="url"
              formControlName="imageUrl"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://..."
            />
          </div>

          <!-- Submit -->
          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              [disabled]="form.invalid || productService.loading()"
              class="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (productService.loading()) {
                Enregistrement...
              } @else {
                {{ isEditMode ? 'Mettre à jour' : 'Créer le produit' }}
              }
            </button>
            <a
              routerLink="/products"
              class="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-center"
            >
              Annuler
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  protected readonly productService = inject(ProductService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEditMode = false;
  productId: string | null = null;

  categories = [
    { value: ProductCategory.ELECTRONICS, label: 'Électronique' },
    { value: ProductCategory.CLOTHING, label: 'Vêtements' },
    { value: ProductCategory.FOOD, label: 'Alimentation' },
    { value: ProductCategory.BOOKS, label: 'Livres' },
    { value: ProductCategory.OTHER, label: 'Autre' },
  ];

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [null, [Validators.required, Validators.min(0)]],
    stock: [null, [Validators.required, Validators.min(0)]],
    category: ['', [Validators.required]],
    imageUrl: [''],
  });

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      // Charger le produit pour l'édition
      this.productService.getProductById(this.productId).subscribe({
        next: (response) => {
          if (response.data) {
            this.form.patchValue(response.data);
          }
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formData = this.form.value;

    if (this.isEditMode && this.productId) {
      // Mode édition
      const updateDto: IUpdateProductDto = formData;
      this.productService.updateProduct(this.productId, updateDto).subscribe();
    } else {
      // Mode création
      const createDto: ICreateProductDto = formData;
      this.productService.createProduct(createDto).subscribe();
    }
  }
}
```

### 4.5 Fichier index

**Fichier** : `src/app/presentation/pages/products/index.ts`

```typescript
export * from './product-list/product-list.component';
export * from './product-detail/product-detail.component';
export * from './product-form/product-form.component';
```

---

## Étape 5 : Routes et Navigation

### 5.1 Mettre à jour app.routes.ts

**Fichier** : `src/app/app.routes.ts`

Ajouter les routes pour les produits :

```typescript
import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@infrastructure/guards';

export const routes: Routes = [
  // ... routes existantes ...

  // Routes produits
  {
    path: 'products',
    loadComponent: () =>
      import('@presentation/layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@presentation/pages/products/product-list/product-list.component').then(
            (m) => m.ProductListComponent
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('@presentation/pages/products/product-form/product-form.component').then(
            (m) => m.ProductFormComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('@presentation/pages/products/product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('@presentation/pages/products/product-form/product-form.component').then(
            (m) => m.ProductFormComponent
          ),
      },
    ],
  },

  // ... autres routes ...
];
```

### 5.2 Ajouter un lien dans la navigation

**Fichier** : `src/app/presentation/layouts/main-layout/main-layout.component.ts`

Ajouter dans le template :

```html
<a
  routerLink="/products"
  class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
>
  Produits
</a>
```

---

## Étape 6 : Test complet

### 6.1 Démarrer l'application

```bash
npm run dev
```

### 6.2 Tester les fonctionnalités

1. Aller sur `http://localhost:4200/products`
2. Voir la liste des produits (mock data)
3. Cliquer sur "Voir" pour voir le détail
4. Cliquer sur "Modifier" pour éditer
5. Cliquer sur "+ Nouveau produit" pour créer
6. Supprimer un produit

### 6.3 Résumé de ce qu'on a créé

```
src/app/
├── domain/products/
│   ├── product.interface.ts      # Interfaces et types
│   └── index.ts
│
├── infrastructure/
│   ├── api/routes/product.routes.ts      # Routes API
│   ├── stores/product.store.ts           # État avec Signals
│   └── services/product-mock.service.ts  # Simulation API
│
├── application/
│   ├── commands/products/
│   │   ├── create-product.command.ts
│   │   ├── update-product.command.ts
│   │   ├── delete-product.command.ts
│   │   └── index.ts
│   ├── queries/products/
│   │   ├── get-products.query.ts
│   │   ├── get-product-by-id.query.ts
│   │   └── index.ts
│   └── services/product.service.ts       # Façade
│
└── presentation/pages/products/
    ├── product-list/
    ├── product-detail/
    ├── product-form/
    └── index.ts
```

---

## Pour passer en production

Pour remplacer le mock par de vrais appels API :

1. Créer `src/app/infrastructure/services/product.service.ts` qui utilise HttpClient
2. Modifier les Commands/Queries pour utiliser le vrai service au lieu du mock
3. Configurer l'URL de l'API dans `environment.ts`

```typescript
// Exemple de vrai service
@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly http = inject(HttpClient);

  getProducts(params?: IPaginationParams) {
    return this.http.get<IApiResponse<IProduct[]>>(
      apiRoutes.products.getAll(),
      { params }
    );
  }

  // ... autres méthodes
}
```

---

## Félicitations ! 🎉

Tu as créé un module CRUD complet avec :
- ✅ Clean Architecture (4 couches)
- ✅ CQRS (Commands séparés des Queries)
- ✅ State Management avec Signals
- ✅ Simulation d'API (Mock)
- ✅ Formulaires réactifs avec validation
- ✅ Lazy loading des routes

Tu peux maintenant appliquer ce pattern pour créer d'autres modules (Users, Orders, etc.).
