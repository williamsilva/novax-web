import { Action, createReducer, on } from '@ngrx/store';

import { ContentProps, EventFilters, User } from 'src/app/models';
import * as actions from 'src/app/store/actions/users.actions';

export interface UserState {
  success: boolean;
  notUnique: boolean;
  isEditing: boolean;
  isLoading: boolean;
  data: ContentProps;
  params: EventFilters;
  allUsers: User.Minimal[];
}

export const initialUserState: UserState = {
  allUsers: [],
  success: false,
  notUnique: false,
  isLoading: false,
  isEditing: false,
  data: { content: [], page: 0 },
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _userReducer = createReducer(
  initialUserState,

  on(actions.setParamsUsers, (state, { params }) => ({ ...state, params })),
  on(actions.isEditingUser, (state, { isEditing }) => ({ ...state, isLoading: false, isEditing })),

  /* Search Exist Document User */
  on(actions.notUniqueUser, (state, { payload }) => ({ ...state, payload })),

  on(actions.notUniqueUserSuccess, (state, { notUnique }) => ({
    ...state,
    notUnique,
  })),

  on(actions.notUniqueUserError, (state) => ({
    ...state,
  })),

  /* Search All User */
  on(actions.searchAllUsers, (state) => ({ ...state, isLoading: true })),

  on(actions.searchAllUsersSuccess, (state, { allUsers }) => ({
    ...state,
    allUsers,
    isLoading: false,
  })),

  on(actions.searchAllUsersError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Search User */
  on(actions.searchUser, (state) => ({ ...state, isLoading: true })),

  on(actions.searchUserSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.searchUserError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create User */
  on(actions.createUser, (state, { payload }) => ({ ...state, isLoading: true, payload, success: false })),

  on(actions.createUserSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createUserError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update User */
  on(actions.updateUser, (state, { id, payload }) => ({
    id,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateUserSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateUserError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Change Password User */
  on(actions.changePasswordUser, (state, { payload }) => ({ ...state, isLoading: true, payload, success: false })),

  on(actions.changePasswordUserSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.changePasswordUserError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Activation User */
  on(actions.activationUser, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.activationUserSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.activationUserError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Deactivate User */
  on(actions.deactivateUser, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.deactivateUserSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.deactivateUserError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Activation User */
  on(actions.activationMultipleUser, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.activationMultipleUserSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.activationMultipleUserError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Deactivate User */
  on(actions.deactivateMultipleUser, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.deactivateMultipleUserSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.deactivateMultipleUserError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete User */
  on(actions.deleteUser, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteUserSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteUserError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function userReducer(state: UserState = initialUserState, actions: Action) {
  return _userReducer(state, actions);
}
