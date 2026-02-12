import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout-auth').then((c) => c.LayoutAuth),
    children: [
      // {
      //   path: 'login',
      //   loadComponent: () => import('./login/login').then((c) => c.Login),
      //   title: 'Mediaplanning | Authentification',
      //   data: {
      //     breadcrumb: 'Authentification',
      //   },
      // },
    ],
  },
];
