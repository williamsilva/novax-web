import { Action, createReducer, on } from '@ngrx/store';
import { ContentProps, EventFilters } from 'src/app/models';

import * as actions from 'src/app/store/actions/maintenance.actions';

export interface MaintenanceState {
  success: boolean;
  isEditing: boolean;
  isLoading: boolean;
  data: ContentProps;
  params: EventFilters;
}

export const initialMaintenanceState: MaintenanceState = {
  success: false,
  isLoading: false,
  isEditing: false,
  data: { content: [], page: 0 },
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _maintenanceReducer = createReducer(
  initialMaintenanceState,

  on(actions.setParamsMaintenances, (state, { params }) => ({ ...state, params })),
  on(actions.isEditingMaintenance, (state, { isEditing }) => ({ ...state, isEditing })),

  /* Search Maintenance */
  on(actions.searchMaintenance, (state) => ({ ...state, isLoading: true })),

  on(actions.searchMaintenanceSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.searchMaintenanceError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create Maintenance */
  on(actions.createMaintenance, (state, { payload }) => ({ ...state, isLoading: true, payload, success: false })),

  on(actions.createMaintenanceSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createMaintenanceError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update Maintenance */
  on(actions.updateMaintenance, (state, { uuid, payload }) => ({
    uuid,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateMaintenanceSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateMaintenanceError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete Maintenance */
  on(actions.deleteMaintenance, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteMaintenanceSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteMaintenanceError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function maintenanceReducer(state: MaintenanceState = initialMaintenanceState, actions: Action) {
  return _maintenanceReducer(state, actions);
}
