import { AuthService } from '@/components/shared/services/auth';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-aside',
  imports: [],
  templateUrl: './aside.html',
  styleUrl: './aside.scss',
})
export class Aside {
  authService = inject(AuthService);
}
