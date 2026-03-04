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

    this.authService.login(data).subscribe({
      next: (res: any) => {
        const role = this.authService.activeRole();

        if (role === 'ADMIN') {
          this.router.navigate(['/admin'], { replaceUrl: true });
        } else if (role === 'SHOP') {
          this.router.navigate(['/shop-dashboard'], { replaceUrl: true });
        } else {
          this.router.navigate(['/home'], { replaceUrl: true });
        }
      },
    });
  }
}
