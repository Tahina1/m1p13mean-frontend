import { AuthService } from '@/components/shared/services/auth';
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

  login() {
    const data = this.form.getRawValue();
    this.authService.loading.set(true);

    this.authService.login(data).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.authService.userSignal.set(res.user);
        this.authService.setAuthPopup(false);

        const role = res.user.roles?.[0];

        if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (role === 'SHOP') {
          this.router.navigate(['/shop-dashboard']);
        } else {
          this.router.navigate(['/home']);
        }

        this.authService.loading.set(false);
      },
      error: () => {
        this.authService.loading.set(false);
      },
    });
  }
}
