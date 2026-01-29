import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Auth layout component.
 * Simple layout for authentication pages.
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="text-center text-3xl font-extrabold text-gray-900">
          M1P13 Mean Frontend
        </h2>
      </div>
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AuthLayoutComponent {}
