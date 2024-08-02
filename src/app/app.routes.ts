import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.routes'),
  },
  {
    path: 'delivery-list',
    loadChildren: () => import('./modules/delivery-list/delivery-list.routes'),
  },
  { path: '**', redirectTo: '/dashboard' },
];
