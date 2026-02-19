import { AuthService } from '@/components/shared/services/auth';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  authService = inject(AuthService);
  user = this.authService.userSignal;

  ngOnInit() {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.authService.userSignal.set(JSON.parse(stored));
    }
  }
}
