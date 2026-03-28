import { createAction, props } from '@ngrx/store';

import { ContentProps, Fleets, EventFilters } from 'src/app/models';

export const setParamsFleets = createAction('[Fleets] Params', props<{ params: EventFilters }>());
export const isEditingFleets = createAction('[Fleets] IsEditing', props<{ isEditing: boolean }>());

/* Search Last ArrivalDate */
export const searchLastArrivalDate = createAction('[Fleets] lastArrivalDate');
export const searchLastArrivalDateError = createAction('[Fleets] lastArrivalDate Error');
export const searchLastArrivalDateSuccess = createAction(
  '[Fleets] lastArrivalDate Success',
  props<{ lastArrivalDate: Date }>(),
);

/* Search Last Km */
export const searchLastKm = createAction('[Fleets] lastKm');
export const searchLastKmError = createAction('[Fleets] lastKm Error');
export const searchLastKmSuccess = createAction('[Fleets] lastKm Success', props<{ lastKm: number }>());

/* Search Fleets */
export const searchFleets = createAction('[Fleets] Search');
export const searchFleetsError = createAction('[Fleets] Search Error');
export const searchFleetsSuccess = createAction('[Fleets] Search Success', props<{ data: ContentProps }>());

/* Create Fleets */
export const createFleetsError = createAction('[Fleets] Create Error');
export const createFleetsSuccess = createAction('[Fleets] Create Success');
export const createFleets = createAction('[Fleets] Create', props<{ payload: Fleets.Input }>());

/* Update Fleets */
export const updateFleetsError = createAction('[Fleets] Update Error');
export const updateFleetsSuccess = createAction('[Fleets] Update Success');
export const updateFleets = createAction('[Fleets] Update', props<{ id: number; payload: Fleets.Input }>());

/* Delete Fleets */
export const deleteFleetsError = createAction('[Fleets] Delete Error');
export const deleteFleetsSuccess = createAction('[Fleets] Delete Success');
export const deleteFleets = createAction('[Fleets] Delete Fleets', props<{ payload: number }>());
