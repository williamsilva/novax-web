import { createAction, props } from '@ngrx/store';

import { ContentProps, EventFilters, Courtesy } from 'src/app/models';

export const setParamsCourtesy = createAction('[Courtesy] Params', props<{ params: EventFilters }>());
export const isEditingCourtesy = createAction('[Courtesy] IsEditing', props<{ isEditing: boolean }>());
export const isExchangedCourtesy = createAction('[Courtesy] IsExchanged', props<{ isExchanged: boolean }>());

/* Search Courtesy */
export const searchCourtesy = createAction('[Courtesy] Search');
export const searchCourtesyError = createAction('[Courtesy] Search Error');
export const searchCourtesySuccess = createAction('[Courtesy] Search Success', props<{ data: ContentProps }>());

/* Create Courtesy */
export const createCourtesyError = createAction('[Courtesy] Create Error');
export const createCourtesySuccess = createAction('[Courtesy] Create Success');
export const createCourtesy = createAction('[Courtesy] Create', props<{ payload: Courtesy.Input }>());

/* Update Courtesy */
export const updateCourtesyError = createAction('[Courtesy] Update Error');
export const updateCourtesySuccess = createAction('[Courtesy] Update Success');
export const updateCourtesy = createAction('[Courtesy] Update', props<{ uuid: string; payload: Courtesy.Input }>());

/* Delete Courtesy */
export const deleteCourtesyError = createAction('[Courtesy] Delete Error');
export const deleteCourtesySuccess = createAction('[Courtesy] Delete Success');
export const deleteCourtesy = createAction('[Courtesy] Delete Courtesy', props<{ payload: number }>());

/* Activation Courtesy */
export const activationCourtesyError = createAction('[Courtesy] Activation Error');
export const activationCourtesySuccess = createAction('[Courtesy] Activation Success');
export const activationCourtesy = createAction('[Courtesy] Activation', props<{ payload: string }>());

/* Deactivate Courtesy */
export const deactivateCourtesyError = createAction('[Courtesy] Deactivate Error');
export const deactivateCourtesySuccess = createAction('[Courtesy] Deactivate Success');
export const deactivateCourtesy = createAction('[Courtesy] Deactivate', props<{ payload: string }>());

/* Replacement Multiple Courtesy */
export const replacementMultipleCourtesyError = createAction('[Courtesy] Replacement Multiple Error');
export const replacementMultipleCourtesySuccess = createAction('[Courtesy] Replacement Multiple Success');
export const replacementMultipleCourtesy = createAction(
  '[Courtesy] Replacement Multiple',
  props<{ payload: Courtesy.ReplacementInput }>(),
);
