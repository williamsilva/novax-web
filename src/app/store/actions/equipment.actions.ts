import { createAction, props } from '@ngrx/store';

import { ContentProps, Equipment, EventFilters } from 'src/app/models';

export const setParamsEquipments = createAction('[Equipment] Params', props<{ params: EventFilters }>());
export const setParamsPatrimony = createAction('[Equipment] Params', props<{ paramsPatrimony: number }>());
export const isEditingEquipment = createAction('[Equipment] IsEditing', props<{ isEditing: boolean }>());

/* Search Equipment */
export const searchEquipment = createAction('[Equipment] Search');
export const searchEquipmentError = createAction('[Equipment] Search Error');
export const searchEquipmentSuccess = createAction('[Equipment] Search Success', props<{ data: ContentProps }>());

/* Create Equipment */
export const createEquipmentError = createAction('[Equipment] Create Error');
export const createEquipmentSuccess = createAction('[Equipment] Create Success');
export const createEquipment = createAction('[Equipment] Create', props<{ payload: Equipment.Input }>());

/* Update Equipment */
export const updateEquipmentError = createAction('[Equipment] Update Error');
export const updateEquipmentSuccess = createAction('[Equipment] Update Success');
export const updateEquipment = createAction('[Equipment] Update', props<{ uuid: string; payload: Equipment.Input }>());

/* Delete Equipment */
export const deleteEquipmentError = createAction('[Equipment] Delete Error');
export const deleteEquipmentSuccess = createAction('[Equipment] Delete Success');
export const deleteEquipment = createAction('[Equipment] Delete Equipment', props<{ payload: number }>());

/* Search Patrimony*/
export const searchPatrimony = createAction('[Patrimony] Search');
export const searchPatrimonyError = createAction('[Patrimony] Search Error');
export const searchPatrimonySuccess = createAction(
  '[Patrimony] Search Success',
  props<{ equipment: Equipment.Summary }>(),
);
