import { Action, createReducer, on } from '@ngrx/store';

import { ContentProps, EventFilters, Location } from 'src/app/models';
import * as actions from 'src/app/store/actions/location.actions';

export interface LocationState {
  success: boolean;
  isEditing: boolean;
  isLoading: boolean;
  data: ContentProps;
  params: EventFilters;
  location: Location.Model[];
}

export const initialLocationState: LocationState = {
  location: [],
  success: false,
  isLoading: false,
  isEditing: false,
  data: { content: [], page: 0 },
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _locationReducer = createReducer(
  initialLocationState,

  on(actions.setParamsLocations, (state, { params }) => ({ ...state, params })),
  on(actions.isEditingLocation, (state, { isEditing }) => ({ ...state, isEditing })),

  /* Search All Location*/
  on(actions.searchAllLocation, (state) => ({ ...state })),

  on(actions.searchAllLocationSuccess, (state, { location }) => ({
    ...state,
    location,
  })),

  on(actions.searchAllLocationError, (state) => ({
    ...state,
  })),

  /* Search Location */
  on(actions.searchLocation, (state) => ({ ...state, isLoading: true })),

  on(actions.searchLocationSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.searchLocationError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create Location */
  on(actions.createLocation, (state, { payload }) => ({ ...state, isLoading: true, payload, success: false })),

  on(actions.createLocationSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createLocationError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update Location */
  on(actions.updateLocation, (state, { uuid, payload }) => ({
    uuid,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateLocationSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateLocationError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete Location */
  on(actions.deleteLocation, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteLocationSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteLocationError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Activation Location */
  on(actions.activationLocation, (state, { uuid }) => ({
    uuid,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.activationLocationSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.activationLocationError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Deactivate Location */
  on(actions.deactivateLocation, (state, { uuid }) => ({
    uuid,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.deactivateLocationSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.deactivateLocationError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),
);

export function locationReducer(state: LocationState = initialLocationState, actions: Action) {
  return _locationReducer(state, actions);
}
