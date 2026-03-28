import { Action, createReducer, on } from '@ngrx/store';
import { ContentProps, EventFilters } from 'src/app/models';

import * as actions from 'src/app/store/actions/chlorine-parameters.actions';

export interface ChlorineParametersState {
  success: boolean;
  data: ContentProps;
  isEditing: boolean;
  isLoading: boolean;
  params: EventFilters;
  shiftParams: number[];
  chlorineParameters: ContentProps;
}

export const initialChlorineParametersState: ChlorineParametersState = {
  success: false,
  shiftParams: [],
  isLoading: false,
  isEditing: false,
  data: { content: [], page: 0 },
  chlorineParameters: { content: [], page: 0 },
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _chlorineParametersReducer = createReducer(
  initialChlorineParametersState,

  on(actions.setParamsChlorineParameters, (state, { params }) => ({ ...state, params })),
  on(actions.setParamsChlorineShift, (state, { shiftParams }) => ({ ...state, shiftParams })),
  on(actions.isEditingChlorineParameters, (state, { isEditing }) => ({ ...state, isEditing })),

  /* Search ChlorineParameters By Shift */
  on(actions.searchChlorineParametersByShift, (state) => ({ ...state, isLoading: true })),

  on(actions.searchChlorineParametersByShiftSuccess, (state, { chlorineParameters }) => ({
    ...state,
    chlorineParameters,
    isLoading: false,
  })),

  on(actions.searchChlorineParametersByShiftError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Search ChlorineParameters */
  on(actions.searchChlorineParameters, (state) => ({ ...state, isLoading: true })),

  on(actions.searchChlorineParametersSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.searchChlorineParametersError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create ChlorineParameters */
  on(actions.createChlorineParameters, (state, { payload }) => ({
    ...state,
    isLoading: true,
    payload,
    success: false,
  })),

  on(actions.createChlorineParametersSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createChlorineParametersError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update ChlorineParameters */
  on(actions.updateChlorineParameters, (state, { uuid, payload }) => ({
    uuid,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateChlorineParametersSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateChlorineParametersError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete ChlorineParameters */
  on(actions.deleteChlorineParameters, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteChlorineParametersSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteChlorineParametersError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function chlorineParametersReducer(
  state: ChlorineParametersState = initialChlorineParametersState,
  actions: Action,
) {
  return _chlorineParametersReducer(state, actions);
}
