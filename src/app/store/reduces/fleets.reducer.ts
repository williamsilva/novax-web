import { Action, createReducer, on } from '@ngrx/store';
import { ContentProps, EventFilters } from 'src/app/models';

import * as actions from 'src/app/store/actions/fleets.actions';

export interface FleetsState {
  lastKm: number;
  success: boolean;
  data: ContentProps;
  isEditing: boolean;
  isLoading: boolean;
  params: EventFilters;
  lastArrivalDate: Date;
}

export const initialFleetsState: FleetsState = {
  lastKm: 0,
  success: false,
  isLoading: false,
  isEditing: false,
  data: { content: [], page: 0 },
  lastArrivalDate: new Date('2000-01-01'),
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _fleetsReducer = createReducer(
  initialFleetsState,

  on(actions.setParamsFleets, (state, { params }) => ({ ...state, params })),
  on(actions.isEditingFleets, (state, { isEditing }) => ({ ...state, isEditing })),

  /* Search Last Arrival Date */
  on(actions.searchLastArrivalDate, (state) => ({ ...state })),

  on(actions.searchLastArrivalDateSuccess, (state, { lastArrivalDate }) => ({
    ...state,
    lastArrivalDate,
  })),

  on(actions.searchLastArrivalDateError, (state) => ({
    ...state,
  })),

  /* Search Last Km */
  on(actions.searchLastKm, (state) => ({ ...state })),

  on(actions.searchLastKmSuccess, (state, { lastKm }) => ({
    ...state,
    lastKm,
  })),

  on(actions.searchLastKmError, (state) => ({
    ...state,
  })),

  /* Search Fleets */
  on(actions.searchFleets, (state) => ({ ...state, isLoading: true })),

  on(actions.searchFleetsSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.searchFleetsError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create Fleets */
  on(actions.createFleets, (state, { payload }) => ({ ...state, isLoading: true, payload, success: false })),

  on(actions.createFleetsSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createFleetsError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update Fleets */
  on(actions.updateFleets, (state, { id, payload }) => ({
    id,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateFleetsSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateFleetsError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete Fleets */
  on(actions.deleteFleets, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteFleetsSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteFleetsError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function fleetsReducer(state: FleetsState = initialFleetsState, actions: Action) {
  return _fleetsReducer(state, actions);
}
