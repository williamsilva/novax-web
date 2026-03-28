import { createAction, props } from '@ngrx/store';

import { ContentProps, ChlorineParameters, EventFilters } from 'src/app/models';

export const setParamsChlorineParameters = createAction(
  '[ChlorineParameters] Params',
  props<{ params: EventFilters }>(),
);
export const setParamsChlorineShift = createAction(
  '[ChlorineParameters] Shift Params',
  props<{ shiftParams: number[] }>(),
);
export const isEditingChlorineParameters = createAction(
  '[ChlorineParameters] IsEditing',
  props<{ isEditing: boolean }>(),
);

/* Search ChlorineParameters By Shift*/
export const searchChlorineParametersByShift = createAction('[ChlorineParametersByShift] Search');
export const searchChlorineParametersByShiftError = createAction('[ChlorineParametersByShift] Search Error');
export const searchChlorineParametersByShiftSuccess = createAction(
  '[ChlorineParametersByShift] Search Success',
  props<{ chlorineParameters: ContentProps }>(),
);

/* Search ChlorineParameters */
export const searchChlorineParameters = createAction('[ChlorineParameters] Search');
export const searchChlorineParametersError = createAction('[ChlorineParameters] Search Error');
export const searchChlorineParametersSuccess = createAction(
  '[ChlorineParameters] Search Success',
  props<{ data: ContentProps }>(),
);

/* Create ChlorineParameters */
export const createChlorineParametersError = createAction('[ChlorineParameters] Create Error');
export const createChlorineParametersSuccess = createAction('[ChlorineParameters] Create Success');
export const createChlorineParameters = createAction(
  '[ChlorineParameters] Create',
  props<{ payload: ChlorineParameters.Input }>(),
);

/* Update ChlorineParameters */
export const updateChlorineParametersError = createAction('[ChlorineParameters] Update Error');
export const updateChlorineParametersSuccess = createAction('[ChlorineParameters] Update Success');
export const updateChlorineParameters = createAction(
  '[ChlorineParameters] Update',
  props<{ uuid: string; payload: ChlorineParameters.Input }>(),
);

/* Delete ChlorineParameters */
export const deleteChlorineParametersError = createAction('[ChlorineParameters] Delete Error');
export const deleteChlorineParametersSuccess = createAction('[ChlorineParameters] Delete Success');
export const deleteChlorineParameters = createAction(
  '[ChlorineParameters] Delete ChlorineParameters',
  props<{ payload: number }>(),
);
