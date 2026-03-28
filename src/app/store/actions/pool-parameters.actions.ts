import { createAction, props } from '@ngrx/store';

import { ContentProps, EventFilters, PoolParameters } from 'src/app/models';

export const setParamsPoolParameters = createAction('[PoolParameters] Params', props<{ params: EventFilters }>());
export const setParamsPoolShift = createAction('[PoolParameters] Shift Params', props<{ shiftParams: string[] }>());
export const isEditingPoolParameters = createAction('[PoolParameters] IsEditing', props<{ isEditing: boolean }>());

/* Search PoolParameters By Shift*/
export const searchPoolParametersByShift = createAction('[PoolParametersByShift] Search');
export const searchPoolParametersByShiftError = createAction('[PoolParametersByShift] Search Error');
export const searchPoolParametersByShiftSuccess = createAction(
  '[PoolParametersByShift] Search Success',
  props<{ poolParameters: PoolParameters.Model[] }>(),
);

/* Search PoolParameters */
export const searchPoolParameters = createAction('[PoolParameters] Search');
export const searchPoolParametersError = createAction('[PoolParameters] Search Error');
export const searchPoolParametersSuccess = createAction(
  '[PoolParameters] Search Success',
  props<{ data: ContentProps }>(),
);

/* Create PoolParameters */
export const createPoolParametersError = createAction('[PoolParameters] Create Error');
export const createPoolParametersSuccess = createAction('[PoolParameters] Create Success');
export const createPoolParameters = createAction('[PoolParameters] Create', props<{ payload: PoolParameters.Input }>());

/* Update PoolParameters */
export const updatePoolParametersError = createAction('[PoolParameters] Update Error');
export const updatePoolParametersSuccess = createAction('[PoolParameters] Update Success');
export const updatePoolParameters = createAction(
  '[PoolParameters] Update',
  props<{ uuid: string; payload: PoolParameters.Input }>(),
);

/* Delete PoolParameters */
export const deletePoolParametersError = createAction('[PoolParameters] Delete Error');
export const deletePoolParametersSuccess = createAction('[PoolParameters] Delete Success');
export const deletePoolParameters = createAction(
  '[PoolParameters] Delete PoolParameters',
  props<{ payload: number }>(),
);
