import { Aside } from '@/components/core/components/aside/aside';
import { AuthService } from '@/components/shared/services/auth';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [Aside, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  authService = inject(AuthService);
  private router = inject(Router);
  availableRoles = computed(() => {
    const user = this.authService.userSignal();
    const shopId = this.authService.shopId();

    if (!user) return [];

    return user.roles.filter((role: string) => {
      if (role === 'SHOP' && !shopId) {
        return false;
      }
      return true;
    });
  });

  switchRole(role: string) {
    const shopId = this.authService.shopId();

    if (this.authService.activeRole() === role) return;

    if (role === 'SHOP' && !shopId) {
      this.router.navigate(['/create-shop']);
      return;
    }

    this.authService.setActiveRole(role);
    this.navigateByRole(role);
  }

  private navigateByRole(role: string) {
    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (role === 'SHOP') {
      this.router.navigate(['/shop-dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
