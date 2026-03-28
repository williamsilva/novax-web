import { createAction, props } from '@ngrx/store';

import { ContentProps, EventFilters, MaintenanceSchedule } from 'src/app/models';

export const setParamsMaintenanceSchedules = createAction(
  '[MaintenanceSchedule] Params',
  props<{ params: EventFilters }>(),
);
export const isEditingMaintenanceSchedule = createAction(
  '[MaintenanceSchedule] IsEditing',
  props<{ isEditing: boolean }>(),
);

/* Search MaintenanceSchedule */
export const searchMaintenanceSchedule = createAction('[MaintenanceSchedule] Search');
export const searchMaintenanceScheduleError = createAction('[MaintenanceSchedule] Search Error');
export const searchMaintenanceScheduleSuccess = createAction(
  '[MaintenanceSchedule] Search Success',
  props<{ data: ContentProps }>(),
);

/* Create MaintenanceSchedule */
export const createMaintenanceScheduleError = createAction('[MaintenanceSchedule] Create Error');
export const createMaintenanceScheduleSuccess = createAction('[MaintenanceSchedule] Create Success');
export const createMaintenanceSchedule = createAction(
  '[MaintenanceSchedule] Create',
  props<{ payload: MaintenanceSchedule.Input }>(),
);

/* Update MaintenanceSchedule */
export const updateMaintenanceScheduleError = createAction('[MaintenanceSchedule] Update Error');
export const updateMaintenanceScheduleSuccess = createAction('[MaintenanceSchedule] Update Success');
export const updateMaintenanceSchedule = createAction(
  '[MaintenanceSchedule] Update',
  props<{ uuid: string; payload: MaintenanceSchedule.Input }>(),
);

/* Delete MaintenanceSchedule */
export const deleteMaintenanceScheduleError = createAction('[MaintenanceSchedule] Delete Error');
export const deleteMaintenanceScheduleSuccess = createAction('[MaintenanceSchedule] Delete Success');
export const deleteMaintenanceSchedule = createAction(
  '[MaintenanceSchedule] Delete MaintenanceSchedule',
  props<{ payload: number }>(),
);
