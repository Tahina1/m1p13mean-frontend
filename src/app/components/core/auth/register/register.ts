import { AuthService } from '@/components/shared/services/auth';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

type Role = 'ADMIN' | 'SHOP' | 'CLIENT';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  form = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: [''],
    password: [''],
    roles: this.fb.control<Role[]>(['CLIENT']),
  });

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
