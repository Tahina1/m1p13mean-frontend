import { Footer } from '@/components/core/components/footer/footer';
import { Header } from '@/components/core/components/header/header';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from '@/components/core/auth/auth';
import { AuthService } from '@/components/shared/services/auth';

@Component({
  selector: 'app-layout',
  imports: [Header, Footer, RouterOutlet, Auth],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  authService = inject(AuthService);
}
