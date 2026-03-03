import { AuthService } from '@/components/shared/services/auth';
import { CartService } from '@/components/shared/services/cart-service';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  form = this.fb.group({
    email: [''],
    password: [''],
  });

  authService = inject(AuthService);
  loading = false;
  private readonly cartService = inject(CartService);

  login() {
    const data = this.form.getRawValue();
    this.authService.loading.set(true);

    this.authService.login(data).subscribe({
      next: (res: any) => {
        if (res.accessToken) {
          localStorage.setItem('token', res.accessToken);
        } else {
          console.error('NO TOKEN RECEIVED FROM BACKEND', res);
        }
        localStorage.setItem('user', JSON.stringify(res.user));
        this.authService.userSignal.set(res.user);
        this.authService.setAuthPopup(false);

        const roles = res.user.roles || [];

        this.authService.shopId.set(res.user.shopId || null);

        // Decide default active role
        let defaultRole: 'ADMIN' | 'SHOP' | 'CLIENT' = 'CLIENT';

        // If user has only one role, use it
        if (roles.length === 1) {
          defaultRole = roles[0];
        }

        // If multiple roles → default to CLIENT if exists
        if (roles.length > 1) {
          if (roles.includes('CLIENT')) {
            defaultRole = 'CLIENT';
          } else {
            defaultRole = roles[0];
          }
        }

        // Set active role
        this.authService.setActiveRole(defaultRole);

        // Navigate
        this.navigateByRole(defaultRole);

        this.authService.loading.set(false);

        const pendingProduct = sessionStorage.getItem('pendingCartProduct');

        if (pendingProduct) {
          this.cartService.addToCart(pendingProduct).subscribe(() => {
            this.cartService.refreshCartCount();
            sessionStorage.removeItem('pendingCartProduct');
          });
        }
      },
      error: () => {
        this.authService.loading.set(false);
      },
    });
  }

  private navigateByRole(role: string) {
    if (role === 'ADMIN') {
      this.router.navigate(['/admin'], { replaceUrl: true });
    } else if (role === 'SHOP') {
      this.router.navigate(['/shop-dashboard'], { replaceUrl: true });
    } else {
      this.router.navigate(['/home'], { replaceUrl: true });
    }
  }
}
