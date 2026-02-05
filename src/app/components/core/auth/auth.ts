import { AuthService } from '@/components/shared/services/auth';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

type Role = 'ADMIN' | 'SHOP' | 'CLIENT';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  isLogin = true;
  private fb = inject(FormBuilder);
  form = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: [''],
    password: [''],
    roles: this.fb.control<Role[]>(['CLIENT']),
  });
  authService = inject(AuthService);

  login() {
    const { email, password } = this.form.value;

    if (!email || !password) return;

    this.authService.login({ email, password }).subscribe({
      next: (res) => console.log('LOGIN:', res),
      error: (err) => console.error('LOGIN ERROR:', err),
    });
  }

  register() {
    const { firstName, lastName, email, password, roles } = this.form.value;

    this.authService
      .register({
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        email: email ?? '',
        password: password ?? '',
        roles: roles ?? ['CLIENT'],
      })
      .subscribe({
        next: (res) => console.log('REGISTER:', res),
        error: (err) => console.error('REGISTER ERROR:', err),
      });
  }
}
