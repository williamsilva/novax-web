import { Action, createReducer, on } from '@ngrx/store';
import { ContentProps, EventFilters } from 'src/app/models';

import * as actions from 'src/app/store/actions/courtesy.actions';

export interface CourtesyState {
  success: boolean;
  isEditing: boolean;
  isLoading: boolean;
  exchanged: boolean;
  data: ContentProps;
  isExchanged: boolean;
  params: EventFilters;
}

export const initialCourtesyState: CourtesyState = {
  success: false,
  isLoading: false,
  exchanged: false,
  isEditing: false,
  isExchanged: false,
  data: { content: [], page: 0 },
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _courtesyReducer = createReducer(
  initialCourtesyState,

  on(actions.setParamsCourtesy, (state, { params }) => ({ ...state, params })),
  on(actions.isEditingCourtesy, (state, { isEditing }) => ({ ...state, isEditing })),
  on(actions.isExchangedCourtesy, (state, { isExchanged }) => ({ ...state, isExchanged })),

  /* Search Courtesy */
  on(actions.searchCourtesy, (state) => ({ ...state, isLoading: true })),

  on(actions.searchCourtesySuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.searchCourtesyError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create Courtesy */
  on(actions.createCourtesy, (state, { payload }) => ({ ...state, isLoading: true, payload, success: false })),

  on(actions.createCourtesySuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createCourtesyError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update Courtesy */
  on(actions.updateCourtesy, (state, { uuid, payload }) => ({
    uuid,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateCourtesySuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateCourtesyError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete Courtesy */
  on(actions.deleteCourtesy, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteCourtesySuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteCourtesyError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Activation Courtesy */
  on(actions.activationCourtesy, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.activationCourtesySuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.activationCourtesyError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Deactivate Courtesy */
  on(actions.deactivateCourtesy, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.deactivateCourtesySuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.deactivateCourtesyError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Replacement Courtesy */
  on(actions.replacementMultipleCourtesy, (state, { payload }) => ({
    payload,
    ...state,
    exchanged: false,
    isLoading: true,
  })),

  on(actions.replacementMultipleCourtesySuccess, (state) => ({
    ...state,
    exchanged: true,
    isLoading: false,
  })),

  on(actions.replacementMultipleCourtesyError, (state) => ({
    ...state,
    exchanged: false,
    isLoading: false,
  })),

  /* Delete Courtesy */
  on(actions.deleteCourtesy, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteCourtesySuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteCourtesyError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function courtesyReducer(state: CourtesyState = initialCourtesyState, actions: Action) {
  return _courtesyReducer(state, actions);
}
