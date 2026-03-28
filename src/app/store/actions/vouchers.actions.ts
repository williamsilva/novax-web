import { createAction, props } from '@ngrx/store';

import { ContentProps, EventFilters, Voucher } from 'src/app/models';

export const setParamsVouchers = createAction('[Voucher] Params', props<{ params: EventFilters }>());
export const isEditingVoucher = createAction('[Voucher] IsEditing', props<{ isEditing: boolean }>());

/* Search Voucher */
export const searchVoucher = createAction('[Voucher] Search');
export const searchVoucherError = createAction('[Voucher] Search Error');
export const searchVoucherSuccess = createAction('[Voucher] Search Success', props<{ data: ContentProps }>());

/* Create Voucher */
export const createVoucherError = createAction('[Voucher] Create Error');
export const createVoucherSuccess = createAction('[Voucher] Create Success');
export const createVoucher = createAction('[Voucher] Create', props<{ payload: Voucher.Input }>());

/* Update Voucher */
export const updateVoucherError = createAction('[Voucher] Update Error');
export const updateVoucherSuccess = createAction('[Voucher] Update Success');
export const updateVoucher = createAction('[Voucher] Update', props<{ uuid: string; payload: Voucher.Input }>());

/* Delete Voucher */
export const deleteVoucherError = createAction('[Voucher] Delete Error');
export const deleteVoucherSuccess = createAction('[Voucher] Delete Success');
export const deleteVoucher = createAction('[Voucher] Delete Voucher', props<{ payload: number }>());

/* Confirm Voucher */
export const confirmVoucherError = createAction('[Voucher] Confirm Error');
export const confirmVoucherSuccess = createAction('[Voucher] Confirm Success');
export const confirmVoucher = createAction('[Voucher] Confirm', props<{ payload: string }>());

/* Not Confirm Voucher */
export const notConfirmVoucherError = createAction('[Voucher] NotConfirm Error');
export const notConfirmVoucherSuccess = createAction('[Voucher] NotConfirm Success');
export const notConfirmVoucher = createAction('[Voucher] NotConfirm', props<{ payload: string }>());

/* Change Voucher */
export const changeVoucherError = createAction('[Voucher] Change Error');
export const changeVoucherSuccess = createAction('[Voucher] Change Success');
export const changeVoucher = createAction('[Voucher] Change', props<{ payload: string }>());

/* Cancel Voucher */
export const cancelVoucherError = createAction('[Voucher] Cancel Error');
export const cancelVoucherSuccess = createAction('[Voucher] Cancel Success');
export const cancelVoucher = createAction(
  '[Voucher] Cancel',
  props<{ uuid: string; payload: Voucher.CancellationInput }>(),
);

/* To View Voucher */
export const toViewVoucherError = createAction('[Voucher] To View Error');
export const toViewVoucher = createAction('[Voucher] To View', props<{ payload: string }>());
export const toViewVoucherSuccess = createAction('[Voucher] To View Success', props<{ report: Blob }>());

/* To Send Voucher */
export const toSendVoucherError = createAction('[Voucher] To Send Error');
export const toSendVoucherSuccess = createAction('[Voucher] To Send Success');
export const toSendVoucher = createAction('[Voucher] To Send', props<{ payload: string }>());
