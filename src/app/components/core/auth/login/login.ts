import { AuthService } from '@/components/shared/services/auth';
import { CartService } from '@/components/shared/services/cart-service';
import { NotificationService } from '@/components/shared/services/notification-service';
import { Component, inject, signal } from '@angular/core';
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
    email: ['tahina@gmail.com'],
    password: ['tahina'],
  });

  authService = inject(AuthService);
  loading = signal(false);
  private readonly cartService = inject(CartService);
  private readonly notif = inject(NotificationService);

  login() {
    const data = this.form.getRawValue();

    this.loading.set(true);
    this.authService.login(data).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        const role = this.authService.activeRole();
        this.authService.setAuthPopup(false);
        this.notif.show('Connexion réussie !');

        if (role === 'ADMIN') {
          this.router.navigate(['/admin'], { replaceUrl: true });
        } else if (role === 'SHOP') {
          this.router.navigate(['/shop-dashboard'], { replaceUrl: true });
        } else {
          this.router.navigate(['/home'], { replaceUrl: true });
        }
      },
      error: () => {
        this.loading.set(false);
        this.notif.show('Email ou mot de passe incorrect', 'error');
      },
    });
  }
}
