import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shop-layout').then((c) => c.ShopLayout),
    children: [
      //   {
      //     path: '',
      //     redirectTo: 'home',
      //     pathMatch: 'full',
      //   },
      //   {
      //     path: 'home',
      //     loadComponent: () => import('./pages/home/home').then((c) => c.Home),
      //   },
    ],
  },
];
