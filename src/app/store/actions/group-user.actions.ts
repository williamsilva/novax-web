import { createAction, props } from '@ngrx/store';

import { User } from 'src/app/models';

/* Search User In Group */
export const searchUserInGroupError = createAction('[User] Search In Group Error');
export const searchUserInGroup = createAction('[User] Search In Group', props<{ payload: number }>());
export const searchUserInGroupSuccess = createAction(
  '[User] Search In Group Success',
  props<{ usersInGroup: User.Minimal[] }>(),
);

/* Search Available Users */
export const searchAvailableUsersError = createAction('[User] Search AvailableUsers Error');
export const searchAvailableUsers = createAction('[User] Search AvailableUsers', props<{ payload: number }>());
export const searchAvailableUsersSuccess = createAction(
  '[User] Search AvailableUsers Success',
  props<{ usersAvailable: User.Minimal[] }>(),
);

/* Associate Multiple User */
export const associateMultipleUserError = createAction('[User] Associate Multiple Error');
export const associateMultipleUserSuccess = createAction('[User] Associate Multiple Success');
export const associateMultipleUser = createAction(
  '[User] Associate Multiple',
  props<{ groupId: number; usersId: number[] }>(),
);

/* Disassociate Multiple User */
export const disassociateMultipleUserError = createAction('[User] Disassociate Multiple Error');
export const disassociateMultipleUserSuccess = createAction('[User] Disassociate Multiple Success');
export const disassociateMultipleUser = createAction(
  '[User] Disassociate Multiple',
  props<{ groupId: number; usersId: number[] }>(),
);
