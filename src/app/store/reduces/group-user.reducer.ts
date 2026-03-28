import { Action, createReducer, on } from '@ngrx/store';

import { User } from 'src/app/models';
import * as actions from 'src/app/store/actions/group-user.actions';

export interface GroupUserState {
  success: boolean;
  isEditing: boolean;
  isLoading: boolean;
  usersInGroup: User.Minimal[];
  usersAvailable: User.Minimal[];
}

export const initialGroupUserState: GroupUserState = {
  success: false,
  usersInGroup: [],
  isLoading: false,
  isEditing: false,
  usersAvailable: [],
};

export const _groupUserReducer = createReducer(
  initialGroupUserState,

  /* Search User In Group */
  on(actions.searchUserInGroup, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.searchUserInGroupSuccess, (state, { usersInGroup }) => ({
    ...state,
    usersInGroup,
    isLoading: false,
  })),

  on(actions.searchUserInGroupError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Search Available Users */
  on(actions.searchAvailableUsers, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.searchAvailableUsersSuccess, (state, { usersAvailable }) => ({
    ...state,
    usersAvailable,
    isLoading: false,
  })),

  on(actions.searchAvailableUsersError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Associate User */
  on(actions.associateMultipleUser, (state, { usersId }) => ({
    usersId,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.associateMultipleUserSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.associateMultipleUserError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Disassociate User */
  on(actions.disassociateMultipleUser, (state, { usersId }) => ({
    usersId,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.disassociateMultipleUserSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.disassociateMultipleUserError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),
);

export function groupUserReducer(state: GroupUserState = initialGroupUserState, actions: Action) {
  return _groupUserReducer(state, actions);
}
