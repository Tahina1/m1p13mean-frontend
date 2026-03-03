import { AuthService } from '@/components/shared/services/auth';
import { ShopService } from '@/components/shared/services/shop-service';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shop-layout',
  imports: [RouterOutlet],
  templateUrl: './shop-layout.html',
  styleUrl: './shop-layout.scss',
})
export class ShopLayout {
  authService = inject(AuthService);
  shopService = inject(ShopService);
  private router = inject(Router);
  shop = signal<any>(null);
  shopId: string | null = '';

  ngOnInit() {
    this.shopId = this.authService.shopId();

    if (!this.shopId) {
      console.error('No shop linked');
      return;
    }

    this.shopService.getShopById(this.shopId).subscribe((res) => {
      this.shop.set(res);
    });
  }

  switchRole(role: string) {
    if (this.authService.activeRole() === role) return;

    this.authService.setActiveRole(role);

    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (role === 'SHOP') {
      this.router.navigate(['/shop-dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
