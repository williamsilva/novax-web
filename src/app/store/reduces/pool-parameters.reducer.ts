import { Action, createReducer, on } from '@ngrx/store';

import { ContentProps, EventFilters, PoolParameters } from 'src/app/models';
import * as actions from 'src/app/store/actions/pool-parameters.actions';

export interface PoolParametersState {
  success: boolean;
  isEditing: boolean;
  isLoading: boolean;
  data: ContentProps;
  params: EventFilters;
  shiftParams: string[];
  poolParameters: PoolParameters.Model[];
}

export const initialPoolParametersState: PoolParametersState = {
  success: false,
  shiftParams: [],
  isLoading: false,
  isEditing: false,
  poolParameters: [],
  data: { content: [], page: 0 },
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _poolParametersReducer = createReducer(
  initialPoolParametersState,

  on(actions.setParamsPoolParameters, (state, { params }) => ({ ...state, params })),
  on(actions.setParamsPoolShift, (state, { shiftParams }) => ({ ...state, shiftParams })),
  on(actions.isEditingPoolParameters, (state, { isEditing }) => ({ ...state, isEditing })),

  /* Search PoolParameters By Shift */
  on(actions.searchPoolParametersByShift, (state) => ({ ...state, isLoading: true })),

  on(actions.searchPoolParametersByShiftSuccess, (state, { poolParameters }) => ({
    ...state,
    poolParameters,
    isLoading: false,
  })),

  on(actions.searchPoolParametersByShiftError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Search PoolParameters */
  on(actions.searchPoolParameters, (state) => ({ ...state, isLoading: true })),

  on(actions.searchPoolParametersSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.searchPoolParametersError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create PoolParameters */
  on(actions.createPoolParameters, (state, { payload }) => ({ ...state, isLoading: true, payload, success: false })),

  on(actions.createPoolParametersSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createPoolParametersError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update PoolParameters */
  on(actions.updatePoolParameters, (state, { uuid, payload }) => ({
    uuid,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updatePoolParametersSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updatePoolParametersError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete PoolParameters */
  on(actions.deletePoolParameters, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deletePoolParametersSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deletePoolParametersError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function poolParametersReducer(state: PoolParametersState = initialPoolParametersState, actions: Action) {
  return _poolParametersReducer(state, actions);
}
