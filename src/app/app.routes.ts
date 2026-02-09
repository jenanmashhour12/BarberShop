// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/public-salons/public-salons.component')
        .then(m => m.PublicSalonsComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'create' },

      {
        path: 'create',
        loadComponent: () =>
          import('./features/owner/salons/create-salon/create-salon.component')
            .then(m => m.CreateSalonComponent),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./features/owner/salons/bookings/bookings.component')
            .then(m => m.BookingsComponent),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./features/owner/salons/service/service-list.component')
            .then(m => m.ServicesComponent),
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import('./features/owner/salons/Statistics/statistics.component')
            .then(m => m.StatisticsComponent),
      },
      {
        path: 'active-reservations',
        loadComponent: () =>
          import('./pages/moving-window/moving-window.component')
            .then(m => m.MovingWindowComponent),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
