import { createAction, props } from '@ngrx/store';

import { ContentProps, EventFilters, Maintenance } from 'src/app/models';

export const setParamsMaintenances = createAction('[Maintenance] Params', props<{ params: EventFilters }>());
export const isEditingMaintenance = createAction('[Maintenance] IsEditing', props<{ isEditing: boolean }>());

/* Search Maintenance */
export const searchMaintenance = createAction('[Maintenance] Search');
export const searchMaintenanceError = createAction('[Maintenance] Search Error');
export const searchMaintenanceSuccess = createAction('[Maintenance] Search Success', props<{ data: ContentProps }>());

/* Create Maintenance */
export const createMaintenanceError = createAction('[Maintenance] Create Error');
export const createMaintenanceSuccess = createAction('[Maintenance] Create Success');
export const createMaintenance = createAction('[Maintenance] Create', props<{ payload: Maintenance.Input }>());

/* Update Maintenance */
export const updateMaintenanceError = createAction('[Maintenance] Update Error');
export const updateMaintenanceSuccess = createAction('[Maintenance] Update Success');
export const updateMaintenance = createAction(
  '[Maintenance] Update',
  props<{ uuid: string; payload: Maintenance.Input }>(),
);

/* Delete Maintenance */
export const deleteMaintenanceError = createAction('[Maintenance] Delete Error');
export const deleteMaintenanceSuccess = createAction('[Maintenance] Delete Success');
export const deleteMaintenance = createAction('[Maintenance] Delete Maintenance', props<{ payload: number }>());
