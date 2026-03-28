import { createAction, props } from '@ngrx/store';

import { User } from 'src/app/models';

/* Search Permission In Group */
export const searchPermissionInGroupError = createAction('[Permission] Search In Group Error');
export const searchPermissionInGroup = createAction('[Permission] Search In Group', props<{ payload: number }>());
export const searchPermissionInGroupSuccess = createAction(
  '[Permission] Search In Group Success',
  props<{ permissionsInGroup: User.Permission[] }>(),
);

/* Search Available Permissions */
export const searchAvailablePermissionsError = createAction('[Permission] Search AvailablePermissions Error');
export const searchAvailablePermissions = createAction(
  '[Permission] Search AvailablePermissions',
  props<{ payload: number }>(),
);
export const searchAvailablePermissionsSuccess = createAction(
  '[Permission] Search AvailablePermissions Success',
  props<{ permissionsAvailable: User.Permission[] }>(),
);

/* Associate Multiple Permission */
export const associateMultiplePermissionError = createAction('[Permission] Associate Multiple Error');
export const associateMultiplePermissionSuccess = createAction('[Permission] Associate Multiple Success');
export const associateMultiplePermission = createAction(
  '[Permission] Associate Multiple',
  props<{ groupId: number; permissionsId: number[] }>(),
);

/* Disassociate Multiple Permission */
export const disassociateMultiplePermissionError = createAction('[Permission] Disassociate Multiple Error');
export const disassociateMultiplePermissionSuccess = createAction('[Permission] Disassociate Multiple Success');
export const disassociateMultiplePermission = createAction(
  '[Permission] Disassociate Multiple',
  props<{ groupId: number; permissionsId: number[] }>(),
);
