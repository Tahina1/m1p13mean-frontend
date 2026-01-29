import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '@application/services/auth.service';

/**
 * Main layout component.
 * Provides the app shell with navigation and content area.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <a routerLink="/" class="text-xl font-bold text-indigo-600">
                  M1P13 Mean
                </a>
              </div>
              @if (authService.isAuthenticated()) {
                <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <a
                    routerLink="/dashboard"
                    class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </a>
                </div>
              }
            </div>
            <div class="flex items-center">
              @if (authService.isAuthenticated()) {
                <span class="text-gray-700 mr-4">{{ authService.displayName() }}</span>
                <button
                  (click)="onLogout()"
                  class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Logout
                </button>
              } @else {
                <a
                  routerLink="/auth/login"
                  class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  Login
                </a>
                <a
                  routerLink="/auth/register"
                  class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 ml-3"
                >
                  Register
                </a>
              }
            </div>
          </div>
        </div>
      </nav>

      <!-- Main content -->
      <main class="py-10">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class MainLayoutComponent {
  protected readonly authService = inject(AuthService);

  onLogout(): void {
    this.authService.logout().subscribe();
  }
}
