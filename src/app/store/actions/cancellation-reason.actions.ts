import { createAction, props } from '@ngrx/store';
import { CancellationReason, ContentProps, EventFilters } from 'src/app/models';

export const setParamsReasons = createAction('[Reason] Params', props<{ params: EventFilters }>());
export const isEditingReason = createAction('[Reason] IsEditing', props<{ isEditing: boolean }>());

/* Search All Reason*/
export const searchAllReason = createAction('[AllReason] Search');
export const searchAllReasonError = createAction('[AllReason] Search Error');
export const searchAllReasonSuccess = createAction(
  '[AllReason] Search Success',
  props<{ reasons: CancellationReason.Model[] }>(),
);

/* Search Reason */
export const searchReason = createAction('[Reason] Search');
export const searchReasonError = createAction('[Reason] Search Error');
export const searchReasonSuccess = createAction('[Reason] Search Success', props<{ data: ContentProps }>());

/* Create Reason */
export const createReasonError = createAction('[Reason] Create Error');
export const createReasonSuccess = createAction('[Reason] Create Success');
export const createReason = createAction('[Reason] Create', props<{ payload: CancellationReason.Input }>());

/* Update Reason */
export const updateReasonError = createAction('[Reason] Update Error');
export const updateReasonSuccess = createAction('[Reason] Update Success');
export const updateReason = createAction('[Reason] Update', props<{ id: number; payload: CancellationReason.Input }>());

/* Delete Reason */
export const deleteReasonError = createAction('[Reason] Delete Error');
export const deleteReasonSuccess = createAction('[Reason] Delete Success');
export const deleteReason = createAction('[Reason] Delete Reason', props<{ payload: number }>());
