import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout').then((c) => c.Layout),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then((c) => c.Home),
      },
      {
        path: 'shops',
        loadComponent: () => import('./pages/shops/shops').then((c) => c.Shops),
      },
      {
        path: 'shops/:id',
        loadComponent: () => import('./pages/products/products').then((c) => c.Products),
      },
      {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart),
      },
    ],
  },
];
