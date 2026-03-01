import { adminGuard } from '@/components/core/guards/admin-guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-layout').then((c) => c.AdminLayout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/dashboard/dashboard').then((c) => c.Dashboard),
      },
      {
        path: 'shops',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/shops/shops').then((c) => c.Shops),
      },
      {
        path: 'users',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/users/users').then((c) => c.Users),
      },
    ],
  },
];
