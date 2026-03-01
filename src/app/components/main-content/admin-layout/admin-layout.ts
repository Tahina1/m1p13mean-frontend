import { Aside } from '@/components/core/components/aside/aside';
import { AuthService } from '@/components/shared/services/auth';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [Aside, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  authService = inject(AuthService);
}
