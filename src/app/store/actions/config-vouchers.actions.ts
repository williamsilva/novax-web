import { createAction, props } from '@ngrx/store';

import { ConfigVoucher, ContentProps } from 'src/app/models';

export const isEditingConfigVouchers = createAction('[ConfigVouchers] IsEditing', props<{ isEditing: boolean }>());

/* Search By Key*/
export const searchByKeyError = createAction('[ByKey] Search Error');
export const searchByKey = createAction('[ByKey] Search', props<{ key: string }>());
export const searchByKeySuccess = createAction('[ByKey] Search Success', props<{ config: ContentProps }>());

/* Update ConfigVouchers */
export const updateConfigVouchersError = createAction('[ConfigVouchers] Update Error');
export const updateConfigVouchersSuccess = createAction('[ConfigVouchers] Update Success');
export const updateConfigVouchers = createAction(
  '[ConfigVouchers] Update',
  props<{ key: string; payload: ConfigVoucher.Input }>(),
);
