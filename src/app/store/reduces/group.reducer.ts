import { Action, createReducer, on } from '@ngrx/store';

import { ContentProps, EventFilters } from 'src/app/models';
import * as actions from 'src/app/store/actions/groups.actions';

export interface GroupState {
  success: boolean;
  data: ContentProps;
  isEditing: boolean;
  isLoading: boolean;
  params: EventFilters;
}

export const initialGroupState: GroupState = {
  success: false,
  isLoading: false,
  isEditing: false,
  data: { content: [], page: 0 },
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _groupReducer = createReducer(
  initialGroupState,

  on(actions.setParamsGroups, (state, { params }) => ({ ...state, params })),
  on(actions.isEditingGroup, (state, { isEditing }) => ({ ...state, isLoading: false, isEditing })),

  /* Search Group */
  on(actions.searchGroup, (state) => ({ ...state, isLoading: true })),

  on(actions.searchGroupSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.searchGroupError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create Group */
  on(actions.createGroup, (state, { payload }) => ({ ...state, isLoading: true, payload, success: false })),

  on(actions.createGroupSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createGroupError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update Group */
  on(actions.updateGroup, (state, { id, payload }) => ({
    id,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateGroupSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateGroupError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete Group */
  on(actions.deleteGroup, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteGroupSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteGroupError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function groupReducer(state: GroupState = initialGroupState, actions: Action) {
  return _groupReducer(state, actions);
}
