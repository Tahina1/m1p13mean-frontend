import { AuthService } from '@/components/shared/services/auth';
import { CartService } from '@/components/shared/services/cart-service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  authService = inject(AuthService);
  user = this.authService.userSignal;
  private router = inject(Router);
  cartService = inject(CartService);
  cartBounce = signal(false);
  availableRoles = computed(() => {
    const user = this.authService.userSignal();
    const shopId = this.authService.shopId();

    if (!user) return [];

    return user.roles.filter((role: string) => {
      if (role === 'SHOP' && !shopId) {
        return false;
      }
      return true;
    });
  });

  ngOnInit() {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.authService.userSignal.set(JSON.parse(stored));
    }
    if (this.authService.isLoggedIn()) {
      this.cartService.refreshCartCount();
    }
    this.cartService.cartUpdated$.subscribe(() => {
      this.triggerCartBounce();
    });
  }

  triggerCartBounce() {
    this.cartBounce.set(true);

    setTimeout(() => {
      this.cartBounce.set(false);
    }, 350); // must match animation duration
  }

  switchRole(role: string) {
    const shopId = this.authService.shopId();

    if (this.authService.activeRole() === role) return;

    if (role === 'SHOP' && !shopId) {
      this.router.navigate(['/create-shop']);
      return;
    }

    this.authService.setActiveRole(role);
    this.navigateByRole(role);
  }

  private navigateByRole(role: string) {
    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (role === 'SHOP') {
      this.router.navigate(['/shop-dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
