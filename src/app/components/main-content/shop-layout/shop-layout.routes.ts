import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shop-layout').then((c) => c.ShopLayout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((c) => c.Dashboard),
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/product-list/product-list').then((c) => c.ProductList),
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders').then((c) => c.Orders),
      },
    ],
  },
];
