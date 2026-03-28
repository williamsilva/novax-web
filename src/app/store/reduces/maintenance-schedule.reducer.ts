import { Action, createReducer, on } from '@ngrx/store';

import { ContentProps, EventFilters } from 'src/app/models';
import * as actions from 'src/app/store/actions/maintenance-schedule.actions';

export interface MaintenanceScheduleState {
  success: boolean;
  isEditing: boolean;
  isLoading: boolean;
  data: ContentProps;
  params: EventFilters;
}

export const initialMaintenanceScheduleState: MaintenanceScheduleState = {
  success: false,
  isLoading: false,
  isEditing: false,
  data: { content: [], page: 0 },
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _maintenanceScheduleReducer = createReducer(
  initialMaintenanceScheduleState,

  on(actions.setParamsMaintenanceSchedules, (state, { params }) => ({ ...state, params })),
  on(actions.isEditingMaintenanceSchedule, (state, { isEditing }) => ({ ...state, isEditing })),

  /* Search MaintenanceSchedule */
  on(actions.searchMaintenanceSchedule, (state) => ({ ...state, isLoading: true })),

  on(actions.searchMaintenanceScheduleSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.searchMaintenanceScheduleError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create MaintenanceSchedule */
  on(actions.createMaintenanceSchedule, (state, { payload }) => ({
    ...state,
    isLoading: true,
    payload,
    success: false,
  })),

  on(actions.createMaintenanceScheduleSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createMaintenanceScheduleError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update MaintenanceSchedule */
  on(actions.updateMaintenanceSchedule, (state, { uuid, payload }) => ({
    uuid,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateMaintenanceScheduleSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateMaintenanceScheduleError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete MaintenanceSchedule */
  on(actions.deleteMaintenanceSchedule, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteMaintenanceScheduleSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteMaintenanceScheduleError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function maintenanceScheduleReducer(
  state: MaintenanceScheduleState = initialMaintenanceScheduleState,
  actions: Action,
) {
  return _maintenanceScheduleReducer(state, actions);
}
