import { Action, createReducer, on } from '@ngrx/store';

import { EventFilters, ContentProps, CancellationReason } from 'src/app/models';

import * as actions from 'src/app/store/actions/cancellation-reason.actions';

export interface CancellationReasonState {
  success: boolean;
  isEditing: boolean;
  isLoading: boolean;
  data: ContentProps;
  params: EventFilters;
  reasons: CancellationReason.Model[];
}

export const initialCancellationReasonState: CancellationReasonState = {
  reasons: [],
  success: false,
  isLoading: false,
  isEditing: false,
  data: { content: [], page: 0 },
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _cancellationReasonReducer = createReducer(
  initialCancellationReasonState,

  on(actions.setParamsReasons, (state, { params }) => ({ ...state, params })),
  on(actions.isEditingReason, (state, { isEditing }) => ({ ...state, isEditing })),

  /* Search Cancellation Reason*/
  on(actions.searchAllReason, (state) => ({ ...state })),

  on(actions.searchAllReasonSuccess, (state, { reasons }) => ({
    ...state,
    reasons,
  })),

  on(actions.searchAllReasonError, (state) => ({
    ...state,
  })),

  /* Search Reason */
  on(actions.searchReason, (state) => ({ ...state, isLoading: true })),

  on(actions.searchReasonSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.searchReasonError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create Reason */
  on(actions.createReason, (state, { payload }) => ({ ...state, isLoading: true, payload, success: false })),

  on(actions.createReasonSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createReasonError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update Reason */
  on(actions.updateReason, (state, { id, payload }) => ({
    id,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateReasonSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateReasonError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete Reason */
  on(actions.deleteReason, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteReasonSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteReasonError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function cancellationReasonReducer(
  state: CancellationReasonState = initialCancellationReasonState,
  actions: Action,
) {
  return _cancellationReasonReducer(state, actions);
}
