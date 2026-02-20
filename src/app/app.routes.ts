import { Routes } from '@angular/router';
import { adminGuard } from './components/core/guards/admin-guard';
import { shopGuard } from './components/core/guards/shop-guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./components/main-content/layout/layout.routes').then((r) => r.routes),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./components/main-content/admin-layout/admin-layout.routes').then((r) => r.routes),
  },
  {
    path: 'shop-dashboard',
    canActivate: [shopGuard],
    loadChildren: () =>
      import('./components/main-content/shop-layout/shop-layout.routes').then((r) => r.routes),
  },
];
