import { createAction, props } from '@ngrx/store';

import { ContentProps, EventFilters, Historic } from 'src/app/models';

export const setParamsHistoric = createAction('[Historic] Params', props<{ params: EventFilters }>());
export const isEditingHistoric = createAction('[Historic] IsEditing', props<{ isEditing: boolean }>());

/* Search Historic */
export const searchHistoric = createAction('[Historic] Search');
export const searchHistoricError = createAction('[Historic] Search Error');
export const searchHistoricSuccess = createAction('[Historic] Search Success', props<{ data: ContentProps }>());

/* Create Historic */
export const createHistoricError = createAction('[Historic] Create Error');
export const createHistoricSuccess = createAction('[Historic] Create Success');
export const createHistoric = createAction('[Historic] Create', props<{ payload: Historic.Input }>());

/* Update Historic */
export const updateHistoricError = createAction('[Historic] Update Error');
export const updateHistoricSuccess = createAction('[Historic] Update Success');
export const updateHistoric = createAction('[Historic] Update', props<{ uuid: string; payload: Historic.Input }>());

/* Delete Historic */
export const deleteHistoricError = createAction('[Historic] Delete Error');
export const deleteHistoricSuccess = createAction('[Historic] Delete Success');
export const deleteHistoric = createAction('[Historic] Delete Historic', props<{ payload: number }>());
