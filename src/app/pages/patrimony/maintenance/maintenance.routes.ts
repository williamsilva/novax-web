import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth';
import { wsPermissions } from 'src/app/models';

export const MAINTENANCE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'carried-out', pathMatch: 'full' },
      {
        path: 'carried-out',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_MAINTENANCE_CARRIED_OUT_CONSULT],
        },
        loadComponent: () =>
          import('./carried-out/carried-out-consult/carried-out-consult.component').then(
            (c) => c.CarriedOutConsultComponent
          ),
      },
      {
        path: 'schedule',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_MAINTENANCE_SCHEDULE_CONSULT],
        },
        loadComponent: () =>
          import('./schedule/schedule-consult/schedule-consult.component').then((c) => c.ScheduleConsultComponent),
      },
    ],
  },
];
