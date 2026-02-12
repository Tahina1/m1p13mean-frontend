import { AuthService } from '@/components/shared/services/auth';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    email: [''],
    password: [''],
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
}
