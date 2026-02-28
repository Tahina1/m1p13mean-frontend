import { AuthService } from '@/components/shared/services/auth';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-shop-layout',
  imports: [],
  templateUrl: './shop-layout.html',
  styleUrl: './shop-layout.scss',
})
export class ShopLayout {
  authService = inject(AuthService);
}
