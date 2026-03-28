import { createAction, props } from '@ngrx/store';

import { ContentProps, EventFilters, User } from 'src/app/models';

export const setParamsUsers = createAction('[User] Params', props<{ params: EventFilters }>());
export const isEditingUser = createAction('[User] IsEditing', props<{ isEditing: boolean }>());

/* Search All Users */
export const searchAllUsers = createAction('[User] Search All');
export const searchAllUsersError = createAction('[User] Search All Error');
export const searchAllUsersSuccess = createAction('[User] Search All Success', props<{ allUsers: User.Minimal[] }>());

/* Search User */
export const searchUser = createAction('[User] Search');
export const searchUserError = createAction('[User] Search Error');
export const searchUserSuccess = createAction('[User] Search Success', props<{ data: ContentProps }>());

/* Search Not Unique User */
export const notUniqueUserError = createAction('[User] Not Unique Error');
export const notUniqueUser = createAction('[User] Not Unique User', props<{ payload: string }>());
export const notUniqueUserSuccess = createAction('[User] Not Unique Success', props<{ notUnique: boolean }>());

/* Create User */
export const createUserError = createAction('[User] Create Error');
export const createUserSuccess = createAction('[User] Create Success');
export const createUser = createAction('[User] Create', props<{ payload: User.Input }>());

/* Update User */
export const updateUserError = createAction('[User] Update Error');
export const updateUserSuccess = createAction('[User] Update Success');
export const updateUser = createAction('[User] Update', props<{ id: number; payload: User.Input }>());

/* Change Password User */
export const changePasswordUserError = createAction('[User] Change Password Error');
export const changePasswordUserSuccess = createAction('[User] Change Password Success');
export const changePasswordUser = createAction('[User] Change Password', props<{ payload: User.Input }>());

/* Activation User */
export const activationUserError = createAction('[User] Activation Error');
export const activationUserSuccess = createAction('[User] Activation Success');
export const activationUser = createAction('[User] Activation', props<{ payload: number }>());

/* Deactivate User */
export const deactivateUserError = createAction('[User] Deactivate Error');
export const deactivateUserSuccess = createAction('[User] Deactivate Success');
export const deactivateUser = createAction('[User] Deactivate', props<{ payload: number }>());

/* Activation Multiple User */
export const activationMultipleUserError = createAction('[User] Activation Multiple Error');
export const activationMultipleUserSuccess = createAction('[User] Activation Multiple Success');
export const activationMultipleUser = createAction('[User] Activation Multiple', props<{ payload: number[] }>());

/* Deactivate Multiple User */
export const deactivateMultipleUserError = createAction('[User] Deactivate Multiple Error');
export const deactivateMultipleUserSuccess = createAction('[User] Deactivate Multiple Success');
export const deactivateMultipleUser = createAction('[User] Deactivate Multiple', props<{ payload: number[] }>());

/* Delete User */
export const deleteUserError = createAction('[User] Delete Error');
export const deleteUserSuccess = createAction('[User] Delete Success');
export const deleteUser = createAction('[User] Delete User', props<{ payload: number }>());
