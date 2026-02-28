import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout-auth').then((c) => c.LayoutAuth),
  },
];
