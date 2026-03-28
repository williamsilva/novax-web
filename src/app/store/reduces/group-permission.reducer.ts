import { Action, createReducer, on } from '@ngrx/store';
import { User } from 'src/app/models';

import * as actions from 'src/app/store/actions/group-permission.actions';

export interface GroupPermissionState {
  success: boolean;
  isEditing: boolean;
  isLoading: boolean;
  permissionsInGroup: User.Permission[];
  permissionsAvailable: User.Permission[];
}

export const initialGroupPermissionState: GroupPermissionState = {
  success: false,
  isLoading: false,
  isEditing: false,
  permissionsInGroup: [],
  permissionsAvailable: [],
};

export const _groupPermissionReducer = createReducer(
  initialGroupPermissionState,

  /* Search Permission In Group */
  on(actions.searchPermissionInGroup, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.searchPermissionInGroupSuccess, (state, { permissionsInGroup }) => ({
    ...state,
    permissionsInGroup,
    isLoading: false,
  })),

  on(actions.searchPermissionInGroupError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Search Available Permissions */
  on(actions.searchAvailablePermissions, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.searchAvailablePermissionsSuccess, (state, { permissionsAvailable }) => ({
    ...state,
    permissionsAvailable,
    isLoading: false,
  })),

  on(actions.searchAvailablePermissionsError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Associate Permission */
  on(actions.associateMultiplePermission, (state, { permissionsId }) => ({
    permissionsId,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.associateMultiplePermissionSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.associateMultiplePermissionError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Disassociate Permission */
  on(actions.disassociateMultiplePermission, (state, { permissionsId }) => ({
    permissionsId,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.disassociateMultiplePermissionSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.disassociateMultiplePermissionError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),
);

export function groupPermissionReducer(state: GroupPermissionState = initialGroupPermissionState, actions: Action) {
  return _groupPermissionReducer(state, actions);
}
