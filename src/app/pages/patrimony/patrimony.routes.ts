import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth';
import { wsPermissions } from 'src/app/models';

export const PATRIMONY_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'equipment', pathMatch: 'full' },
      {
        path: 'equipment',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_EQUIPMENT_CONSULT],
        },
        loadComponent: () =>
          import('./equipment/equipment-consult/equipment-consult.component').then((c) => c.EquipmentConsultComponent),
      },
      {
        path: 'maintenance',
        loadChildren: () => import('./maintenance/maintenance.routes').then((r) => r.MAINTENANCE_ROUTES),
      },
      {
        path: 'location',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_LOCATION_CONSULT],
        },
        loadComponent: () =>
          import('./location/location-consult/location-consult.component').then((c) => c.LocationConsultComponent),
      },
      {
        path: 'historic',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_HISTORIC_CONSULT],
        },
        loadComponent: () =>
          import('./historic/historic-consult/historic-consult.component').then((c) => c.HistoricConsultComponent),
      },
    ],
  },
];
