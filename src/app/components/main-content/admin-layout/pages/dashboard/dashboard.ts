import { Shop } from '@/components/shared/models/shop';
import { User } from '@/components/shared/models/user';
import { ProductService } from '@/components/shared/services/product-service';
import { ShopService } from '@/components/shared/services/shop-service';
import { UserService } from '@/components/shared/services/user-service';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private userService = inject(UserService);
  private shopService = inject(ShopService);
  private productService = inject(ProductService);

  users = signal<User[]>([]);
  shops = signal<Shop[]>([]);
  nbUsers = signal(0);
  nbShops = signal(0);
  nbProducts = signal(0);

  ngOnInit() {
    this.loadUsers();
    this.loadShops();
    this.loadProducts();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (res) => {
        const sorted = res
          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
          .slice(0, 3);

        this.users.set(sorted);
        this.nbUsers.set(res.length);
      },
      error: (err) => {
        console.error('GET USERS ERROR', err);
      },
    });
  }

  loadShops() {
    this.shopService.getShops().subscribe({
      next: (res) => {
        this.shops.set(res.shops);
        this.nbShops.set(res.shops.length);
      },
      error: (err) => {
        console.error('Error loading shops', err);
      },
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        this.nbProducts.set(res.products.length);
      },
      error: (err) => {
        console.error('Error loading shops', err);
      },
    });
  }
}
