import { Action, createReducer, on } from '@ngrx/store';

import { ContentProps, EventFilters } from 'src/app/models';
import * as actions from 'src/app/store/actions/historic.actions';

export interface HistoricState {
  success: boolean;
  isEditing: boolean;
  isLoading: boolean;
  data: ContentProps;
  params: EventFilters;
}

export const initialHistoricState: HistoricState = {
  success: false,
  isLoading: false,
  isEditing: false,
  data: { content: [], page: 0 },
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _historicReducer = createReducer(
  initialHistoricState,

  on(actions.setParamsHistoric, (state, { params }) => ({ ...state, params })),
  on(actions.isEditingHistoric, (state, { isEditing }) => ({ ...state, isEditing })),

  /* Search Historic */
  on(actions.searchHistoric, (state) => ({ ...state, isLoading: true })),

  on(actions.searchHistoricSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.searchHistoricError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create Historic */
  on(actions.createHistoric, (state, { payload }) => ({ ...state, isLoading: true, payload, success: false })),

  on(actions.createHistoricSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createHistoricError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update Historic */
  on(actions.updateHistoric, (state, { uuid, payload }) => ({
    uuid,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateHistoricSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateHistoricError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete Historic */
  on(actions.deleteHistoric, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteHistoricSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteHistoricError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function historicReducer(state: HistoricState = initialHistoricState, actions: Action) {
  return _historicReducer(state, actions);
}
