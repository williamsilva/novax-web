import { createAction, props } from '@ngrx/store';

import { ContentProps, EventFilters, Location } from 'src/app/models';

export const setParamsLocations = createAction('[Location] Params', props<{ params: EventFilters }>());
export const isEditingLocation = createAction('[Location] IsEditing', props<{ isEditing: boolean }>());

/* Search All Location*/
export const searchAllLocation = createAction('[All Location] Search');
export const searchAllLocationError = createAction('[All Location] Search Error');
export const searchAllLocationSuccess = createAction(
  '[All Location] Search Success',
  props<{ location: Location.Model[] }>(),
);

/* Search Location */
export const searchLocation = createAction('[Location] Search');
export const searchLocationError = createAction('[Location] Search Error');
export const searchLocationSuccess = createAction('[Location] Search Success', props<{ data: ContentProps }>());

/* Create Location */
export const createLocationError = createAction('[Location] Create Error');
export const createLocationSuccess = createAction('[Location] Create Success');
export const createLocation = createAction('[Location] Create', props<{ payload: Location.Input }>());

/* Update Location */
export const updateLocationError = createAction('[Location] Update Error');
export const updateLocationSuccess = createAction('[Location] Update Success');
export const updateLocation = createAction('[Location] Update', props<{ uuid: string; payload: Location.Input }>());

/* Delete Location */
export const deleteLocationError = createAction('[Location] Delete Error');
export const deleteLocationSuccess = createAction('[Location] Delete Success');
export const deleteLocation = createAction('[Location] Delete Location', props<{ payload: number }>());

/* Activation Location */
export const activationLocationError = createAction('[Location] Activation Error');
export const activationLocationSuccess = createAction('[Location] Activation Success');
export const activationLocation = createAction('[Location] Activation', props<{ uuid: string }>());

/* Deactivate Location */
export const deactivateLocationError = createAction('[Location] Deactivate Error');
export const deactivateLocationSuccess = createAction('[Location] Deactivate Success');
export const deactivateLocation = createAction('[Location] Deactivate', props<{ uuid: string }>());
