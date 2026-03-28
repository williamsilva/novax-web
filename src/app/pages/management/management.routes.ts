import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth';
import { wsPermissions } from 'src/app/models';

export const MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      {
        path: 'products',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_PRODUCTS_CONSULT],
        },
        loadComponent: () =>
          import('./product/product-consult/product-consult.component').then((c) => c.ProductConsultComponent),
      },
      {
        path: 'agents',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_AGENTS_CONSULT],
        },
        loadComponent: () => import('./agent/agents/agents.component').then((c) => c.AgentsComponent),
      },
      {
        path: 'reasons',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_CANCELLATION_REASON_CONSULT],
        },
        loadComponent: () =>
          import('./cancellation-reason/cancellation-reason-consult/cancellation-reason-consult.component').then(
            (c) => c.CancellationReasonConsultComponent
          ),
      },
    ],
  },
];
