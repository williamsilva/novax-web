import { Routes } from '@angular/router';
import { AuthGuard, AuthorizedComponent } from './auth';
import { AccessDeniedComponent, ErrorComponent, NotFoundComponent } from './error';
import { wsPermissions } from './models';
import { PagesComponent } from './pages';

export const APP_ROUTES: Routes = [
  { path: 'error', component: ErrorComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: 'access', component: AccessDeniedComponent },
  { path: 'authorized', component: AuthorizedComponent },
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard-voucher', pathMatch: 'full' },
      {
        path: 'dashboard-voucher',
        loadComponent: () =>
          import('./pages/dashboard-voucher/dashboard-voucher.component').then((c) => c.DashboardVoucherComponent),
      },
      {
        path: 'dashboard-equipment',
        data: {
          roles: [wsPermissions.ROLE_VIEW_DASHBOARD_EQUIPMENT],
        },
        loadComponent: () =>
          import('./pages/dashboard-equipment/dashboard-equipment.component').then(
            (c) => c.DashboardEquipmentComponent,
          ),
      },
      {
        path: 'config',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_CONFIG_CONSULT],
        },
        loadComponent: () => import('./pages/config/config.component').then((c) => c.ConfigComponent),
      },
      {
        path: 'voucher',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_VOUCHERS_CONSULT],
        },
        loadComponent: () =>
          import('./pages/voucher/voucher-consult/voucher-consult.component').then((c) => c.VoucherConsultComponent),
      },
      {
        path: 'courtesy',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_COURTESY_CONSULT],
        },
        loadComponent: () =>
          import('./pages/courtesy/courtesy-consult/courtesy-consult.component').then(
            (c) => c.CourtesyConsultComponent,
          ),
      },
      {
        path: 'management',
        loadChildren: () => import('./pages/management/management.routes').then((r) => r.MANAGEMENT_ROUTES),
      },
      {
        path: 'security',
        loadChildren: () => import('./pages/security/security.routes').then((r) => r.SECURITY_ROUTES),
      },
      {
        path: 'patrimony',
        loadChildren: () => import('./pages/patrimony/patrimony.routes').then((r) => r.PATRIMONY_ROUTES),
      },
      {
        path: 'operational',
        loadChildren: () => import('./pages/operational/operational.routes').then((r) => r.OPERATIONAL_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: 'notfound' },
];
