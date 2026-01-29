import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@infrastructure/guards';

/**
 * Application routes.
 * Uses lazy loading for better performance.
 */
export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () =>
      import('@presentation/layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@presentation/pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('@presentation/pages/home/dashboard.component').then((m) => m.DashboardComponent),
      },
    ],
  },

  // Auth routes
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('@presentation/layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('@presentation/pages/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('@presentation/pages/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },

  // Fallback route
  {
    path: '**',
    redirectTo: '',
  },
];
