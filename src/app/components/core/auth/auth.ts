import { AuthService } from '@/components/shared/services/auth';
import { Component, inject } from '@angular/core';
import { Register } from './register/register';
import { Login } from './login/login';

@Component({
  selector: 'app-auth',
  imports: [Register, Login],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  isLogin = true;
  authService = inject(AuthService);
}
