import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth';
import { wsPermissions } from 'src/app/models';

export const OPERATIONAL_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'pool-parameters', pathMatch: 'full' },
      {
        path: 'fleets',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_CHLORINE_PARAMETERS_CONSULT],
        },
        loadComponent: () =>
          import('./fleets/fleets-consult/fleets-consult.component').then((c) => c.FleetsConsultComponent),
      },
      {
        path: 'pool-parameters',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_CHLORINE_PARAMETERS_CONSULT],
        },
        loadComponent: () =>
          import('./pool-parameters/pool-parameters-consult/pool-parameters-consult.component').then(
            (c) => c.PoolParametersConsultComponent,
          ),
      },
      {
        path: 'chlorine-parameters',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_POOL_PARAMETERS_CONSULT],
        },
        loadComponent: () =>
          import('./chlorine-parameters/chlorine-parameters-consult/chlorine-parameters-consult.component').then(
            (c) => c.ChlorineParametersConsultComponent,
          ),
      },
    ],
  },
];
