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

  // register() {
  //   const { firstName, lastName, email, password, roles } = this.form.value;

  //   this.authService
  //     .register({
  //       firstName: firstName ?? '',
  //       lastName: lastName ?? '',
  //       email: email ?? '',
  //       password: password ?? '',
  //       roles: ['CLIENT'],
  //     })
  //     .subscribe({
  //       next: (res) => console.log('REGISTER:', res),
  //       error: (err) => console.error('REGISTER ERROR:', err),
  //     });
  // }

  register() {
    const f = this.form.getRawValue();

    const body = {
      firstName: f.firstName ?? '',
      lastName: f.lastName ?? '',
      email: f.email ?? '',
      password: f.password ?? '',
      roles: ['CLIENT'],
    };

    this.authService.register(body).subscribe({
      next: () => {
        this.authService
          .login({
            email: body.email,
            password: body.password,
          })
          .subscribe((loginRes: any) => {
            console.log('AUTO LOGIN =', loginRes);
            localStorage.setItem('token', loginRes.accessToken);
            localStorage.setItem('user', JSON.stringify(loginRes.user));
            this.authService.userSignal.set(loginRes.user);

            this.authService.setAuthPopup(false);
          });
      },
    });
  }
}
