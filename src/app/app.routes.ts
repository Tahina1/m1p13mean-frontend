import { Routes } from '@angular/router';
import { authGuard } from './components/core/guards/auth-guard';
import { notAuthGuard } from './components/core/guards/not-auth-guard';

export const routes: Routes = [
  {
    path: '',
    // canActivate: [authGuard],
    loadChildren: () =>
      import('./components/main-content/layout/layout.routes').then((r) => r.routes),
  },
  // {
  //   path: '',
  //   // canActivate: [notAuthGuard],
  //   loadChildren: () =>
  //     import('./components/main-content/layout-auth/layout-auth.routes').then((r) => r.routes),
  // },
];
