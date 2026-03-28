import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth';
import { wsPermissions } from 'src/app/models';

export const SECURITY_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_USERS_CONSULT],
        },
        loadComponent: () =>
          import('./users/users-consult/users-consult.component').then((c) => c.UsersConsultComponent),
      },
      {
        path: 'groups',
        canActivate: [AuthGuard],
        data: {
          roles: [wsPermissions.ROLE_GROUPS_CONSULT],
        },
        loadComponent: () =>
          import('./groups/groups-consult/groups-consult.component').then((c) => c.GroupsConsultComponent),
      },
    ],
  },
];
