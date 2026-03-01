import { AuthService } from '@/components/shared/services/auth';
import { CartService } from '@/components/shared/services/cart-service';
import { Component, inject, OnInit, signal } from '@angular/core';
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

  goToCart() {
    this.router.navigate(['/cart']);
  }
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
    console.log(this.cartService.cartCount());
  }

  triggerCartBounce() {
    this.cartBounce.set(true);

    setTimeout(() => {
      this.cartBounce.set(false);
    }, 350); // must match animation duration
  }
}
